import { NextRequest, NextResponse } from "next/server";
import { jsonModel } from "@/lib/gemini";
import { PROGRESS_PROMPT } from "@/lib/prompts";
import { cleanJson } from "@/lib/utils";
import { Message } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { history, idea, stage } = await req.json();

    const conversationText = history.map((msg: Message) => 
      `${msg.role.toUpperCase()}: ${msg.content}`
    ).join("\n");

    const prompt = `${PROGRESS_PROMPT}

Current Stage: ${stage}
Original Idea: "${idea}"

Conversation History:
${conversationText}
`;

    const result = await jsonModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const data = JSON.parse(cleanJson(text));
      return NextResponse.json(data);
    } catch (e) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ error: "Failed to parse progress results" }, { status: 500 });
    }
  } catch (error) {
    console.error("Progress Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
