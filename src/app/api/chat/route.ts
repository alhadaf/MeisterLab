import { NextRequest, NextResponse } from "next/server";
import { getChatModel } from "@/lib/gemini";
import { MENTOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { Message } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    let chatModel = getChatModel(MENTOR_SYSTEM_PROMPT);
    chatModel.generationConfig.responseMimeType = "application/json";

    // Filter out any messages that might be invalid or system messages if stored
    // And merge consecutive messages from the same role to satisfy Gemini API requirements
    const formattedHistory: { role: string; parts: { text: string }[] }[] = [];
    
    if (history.length > 0) {
      let currentRole = history[0].role === 'user' ? 'user' : 'model';
      let currentContent = history[0].content;
      
      for (let i = 1; i < history.length; i++) {
        const msgRole = history[i].role === 'user' ? 'user' : 'model';
        if (msgRole === currentRole) {
          // Merge content
          currentContent += "\n\n" + history[i].content;
        } else {
          // Push previous message
          formattedHistory.push({
            role: currentRole,
            parts: [{ text: currentContent }]
          });
          // Start new message
          currentRole = msgRole;
          currentContent = history[i].content;
        }
      }
      // Push the last message
      formattedHistory.push({
        role: currentRole,
        parts: [{ text: currentContent }]
      });
    }

    const chat = chatModel.startChat({
      history: formattedHistory,
    });
    const result = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (e) {
          console.error("Streaming error", e);
          controller.error(e);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
