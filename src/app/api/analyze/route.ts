import { NextRequest, NextResponse } from "next/server";
import { jsonModel } from "@/lib/gemini";
import { ANALYSIS_PROMPT } from "@/lib/prompts";
import { cleanJson } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { idea, mode, region } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    let prompt = `${ANALYSIS_PROMPT}\n\nUser Idea: "${idea}"`;
    
    // If Autopilot mode, ask for more specific team recommendations and REGIONAL analysis
    if (mode === 'autopilot') {
      prompt += `\n\n[AUTOPILOT MODE ACTIVE]: The user wants immediate team matching and REAL MARKET ANALYSIS.
      Target Region: ${region || "Global"}.
      
      Generate 3 specific, high-quality "EXLab Community Member" profiles that are perfect matches for this specific idea. 
      Include their specific relevant experience.
      
      CRITICAL: Perform a deep analysis of competitors in the ${region || "Global"} market.
      Cite specific weaknesses from customer reviews (Trustpilot/Reddit style sentiment).
      Provide citations (URLs) if possible.`;
    }
    const result = await jsonModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const data = JSON.parse(cleanJson(text));
      return NextResponse.json(data);
    } catch (e) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ error: "Failed to parse analysis results" }, { status: 500 });
    }
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
