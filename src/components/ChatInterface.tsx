"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isLoading, isStreaming }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Bot className="w-12 h-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">EXLab AI Mentor</p>
            <p className="text-sm">Describe your business idea to start validation.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className={cn(
              "flex gap-3",
              msg.role === 'user' ? "flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
              )}>
                {msg.content}
                {isStreaming && msg.id === messages[messages.length - 1].id && msg.role === 'assistant' && (
                   <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse align-middle" />
                )}
              </div>
            </div>

            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && !isStreaming && (
              <div className="flex flex-wrap gap-2 ml-11">
                {msg.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(suggestion)}
                    disabled={isLoading || isStreaming}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-sm">
               <Bot size={16} />
             </div>
             <div className="bg-white border border-slate-100 p-3 rounded-lg rounded-tl-none shadow-sm">
               <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
             </div>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            disabled={isLoading || isStreaming}
          />
          <button
            type="submit"
            disabled={isLoading || isStreaming || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
}
