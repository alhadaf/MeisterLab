"use client";

import { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import StageGateTracker from '@/components/StageGateTracker';
import TeamMatching from '@/components/TeamMatching';
import ValidationReportCard from '@/components/ValidationReportCard';
import FullValidationReport from '@/components/FullValidationReport';
import { Message, IdeaAnalysis, ValidationReport } from '@/types';
import { cleanJson } from '@/lib/utils';

export default function Home() {
  const [idea, setIdea] = useState("");
  const [region, setRegion] = useState("");
  const [mode, setMode] = useState<'guided' | 'autopilot'>('guided');
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<IdeaAnalysis | null>(null);
  const [currentStage, setCurrentStage] = useState(1);

  const handleStartValidation = async () => {
    if (!idea.trim()) return;
    setIsLoading(true);
    
    try {
      // 1. Analyze Idea
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, mode, region }),
      });
      const analysisData = await analyzeRes.json();
      setAnalysis(analysisData);
      setCurrentStage(analysisData.startingStage || 1);
      setHasStarted(true);

      // 2. Start Chat
      // If Autopilot: User message triggers research, not just conversation
      // If Guided: Standard conversation
      
      let initialMessage = idea;
      if (mode === 'autopilot') {
        initialMessage = `[AUTOPILOT_MODE] Validate this idea: ${idea}. Target Region: ${region || "Global"}. Do comprehensive research on market, competitors, and risks. Match a team immediately.`;
      }

      const userMsg: Message = { 
        id: Date.now().toString(), 
        role: 'user', 
        content: idea, // Display original idea to user
        timestamp: new Date() 
      };
      setMessages([userMsg]);
      
      // Trigger AI response immediately
      await streamResponse(initialMessage, []);
      
    } catch (error) {
      console.error("Error starting validation:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content, 
      timestamp: new Date() 
    };
    
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    
    await streamResponse(content, newHistory);
  };

  const streamResponse = async (message: string, history: Message[]) => {
    setIsStreaming(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: history.slice(0, -1), // Send history excluding current message (handled by prompt usually, or included? API expects history + message)
          // Actually my API implementation takes message + history. 
          // If I send message separately, history should be previous messages.
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat API Error:", response.status, errorText);
        throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: '', 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, assistantMsg]);

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          try {
            // Try to find the "message" field in the incomplete buffer
            // We use a regex that is tolerant of unescaped characters in the stream
            const match = buffer.match(/"message":\s*"((?:[^"]|\\.)*)/);
            if (match) {
               // Unescape the JSON string content partially
               // We only handle basic escapes to display text progressively
               const content = match[1]
                 .replace(/\\n/g, '\n')
                 .replace(/\\"/g, '"')
                 .replace(/\\\\/g, '\\'); 
               assistantMsg.content = content;
            }
            
            setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: assistantMsg.content } : m));
          } catch (e) {
            // ignore parsing errors during streaming
          }
        }
        
        // Flush any remaining characters
        buffer += decoder.decode();
        
        // Final parse to get suggestions
        try {
          // Use cleanJson to remove potential markdown blocks
          const cleaned = cleanJson(buffer);
          
          // Try standard parse
          const data = JSON.parse(cleaned);
          assistantMsg.content = data.message;
          assistantMsg.suggestions = data.suggestions;
          setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { 
            ...m, 
            content: data.message,
            suggestions: data.suggestions 
          } : m));
        } catch (e) {
          console.warn("Standard JSON parse failed, attempting fix...", e);
          
          try {
            // Fallback: Try to fix common JSON escaping issues
            // 1. Remove markdown blocks again (just in case cleanJson missed something or if we didn't use it)
            let fixed = cleanJson(buffer);
            
            // 2. Escape unescaped control characters or backslashes that might be causing issues
            // This is a heuristic: Find backslashes that are NOT part of a valid escape sequence
            // Valid JSON escapes: \" \\ \/ \b \f \n \r \t \uXXXX
            fixed = fixed.replace(/\\(?![/bfnrtu"\\'])/g, "\\\\"); 
            
            const data = JSON.parse(fixed);
            assistantMsg.content = data.message;
            assistantMsg.suggestions = data.suggestions;
            
            setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { 
              ...m, 
              content: data.message,
              suggestions: data.suggestions 
            } : m));
          } catch (e2) {
             console.error("Final JSON parse failed completely", e2);
             console.log("Buffer content:", buffer);
             
             // Absolute fallback: If we extracted partial content during stream, keep it.
             // Otherwise, try to dump the raw text if it looks like text
             if (!assistantMsg.content && buffer.length > 0) {
                 assistantMsg.content = buffer;
                 setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: assistantMsg.content } : m));
             }
          }
        }
      }
      
      // Update progress after response
      updateProgress([...history, assistantMsg]);

    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const updateProgress = async (fullHistory: Message[]) => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: fullHistory,
          idea,
          stage: currentStage
        }),
      });
      const data: ValidationReport = await res.json();
      if (data.stage && data.stage !== currentStage) {
        setCurrentStage(data.stage);
        
        // Add a system message to the chat indicating the stage change
        const stageChangeMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🎉 **Congratulations!** You've moved to the **${data.stageName}** stage.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, stageChangeMsg]);
      }
    } catch (error) {
      console.error("Progress update error:", error);
    }
  };

  const handleRestart = () => {
    setIdea("");
    setRegion("");
    setMessages([]);
    setAnalysis(null);
    setCurrentStage(1);
    setHasStarted(false);
  };

  // Show Full Report if Validation Complete (Stage 5) and Analysis exists
  if (currentStage === 5 && analysis) {
    return <FullValidationReport analysis={analysis} onRestart={handleRestart} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              EX
            </div>
            <h1 className="text-xl font-bold text-slate-800">EXLab Validator</h1>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Powered by Gemini AI
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!hasStarted ? (
          <div className="max-w-2xl mx-auto mt-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Validate your startup idea in minutes</h2>
              <p className="text-lg text-slate-600">
                Chat with our AI Mentor to get instant feedback, rigorous validation, and a custom roadmap.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What are you building?
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., A subscription coffee service for remote workers..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 mb-6 resize-none"
              />

              {/* Region Input - Only for Autopilot or Optional */}
              <div className={`mb-6 transition-all duration-300 ${mode === 'autopilot' ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Region / City (Required for Real Analysis)
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., Austin, TX or Southeast Asia"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                />
              </div>
              
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setMode('guided')}
                  className={`flex-1 p-4 rounded-xl border transition-all text-left ${
                    mode === 'guided' 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <BookOpen size={18} className={mode === 'guided' ? 'text-blue-600' : 'text-slate-400'} />
                    Guided Mode
                  </div>
                  <p className="text-xs text-slate-500">Interactive chat to refine your idea step-by-step.</p>
                </button>

                <button
                  onClick={() => setMode('autopilot')}
                  className={`flex-1 p-4 rounded-xl border transition-all text-left ${
                    mode === 'autopilot' 
                    ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' 
                    : 'border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Sparkles size={18} className={mode === 'autopilot' ? 'text-purple-600' : 'text-slate-400'} />
                    Autopilot Mode
                  </div>
                  <p className="text-xs text-slate-500">AI researches market, competitors, and builds a team instantly.</p>
                </button>
              </div>

              <button
                onClick={handleStartValidation}
                disabled={!idea.trim() || isLoading}
                className={`w-full py-4 text-white rounded-xl font-semibold text-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === 'autopilot' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span> {mode === 'autopilot' ? 'Running Autopilot...' : 'Analyzing Idea...'}
                  </>
                ) : (
                  <>
                    {mode === 'autopilot' ? 'Launch Autopilot' : 'Start Validation'} <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "I want to open a specialty coffee shop",
                "Building a fitness tracking app",
                "Starting a marketing agency"
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setIdea(example)}
                  className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-blue-400 hover:shadow-md transition-all text-left"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Chat */}
            <div className="lg:col-span-7 space-y-6">
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isStreaming={isStreaming}
              />
            </div>

            {/* Right Column: Tracker & Team */}
            <div className="lg:col-span-5 space-y-6">
              {/* Show Validation Report Card in Autopilot mode */}
              {mode === 'autopilot' && analysis && (
                <ValidationReportCard analysis={analysis} />
              )}

              <StageGateTracker currentStage={currentStage} />
              
              {analysis && (
                <TeamMatching 
                  skills={analysis.requiredSkills} 
                  mentors={analysis.mentors}
                  isVisible={true}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
