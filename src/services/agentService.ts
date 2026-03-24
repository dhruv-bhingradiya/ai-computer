import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

export interface PlanStep {
  id: number;
  title: string;
  action: string;
  reasoning: string;
}

export interface AgentPlan {
  plan: PlanStep[];
}

export interface FeatureImplementation {
  feature_name: string;
  implementation_steps: {
    step_number: number;
    description: string;
    example: string;
    follow_up: string;
  }[];
  expected_output: string;
}

const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

export async function generatePlan(goal: string, apiKey: string, model: string = "gemini-3-flash-preview"): Promise<AgentPlan> {
  const ai = getAI(apiKey);
  const response = await ai.models.generateContent({
    model,
    contents: `Goal: ${goal}`,
    config: {
      systemInstruction: `You are a High-Precision Autonomous AI Agent for multi-video intelligence extraction. 
      Your mission is to extract, analyze, and report AI tools from YouTube videos with 100% accuracy.
      
      STRICT EXECUTION PIPELINE (MANDATORY):
      STEP 1: VIDEO SELECTION - Extract exactly the latest 10 videos from the provided source.
      STEP 2: TRANSCRIPTION - Extract verified transcripts using the priority hierarchy (Official -> Auto -> Whisper -> Fallback).
      STEP 3: TOOL EXTRACTION - Detect AI tools, platforms, and frameworks using deep semantic analysis.
      STEP 4: CROSS-VIDEO AGGREGATION - Merge, normalize, and deduplicate tools across all 10 videos.
      STEP 5: RANKING - Score each tool based on frequency, mentions, and context. Rank top 50.
      STEP 6: REPORT GENERATION - Produce structured JSON and PDF intelligence reports.
      
      Return a structured plan in JSON format.
      
      RULES:
      - EXACTLY 6 steps matching the pipeline above.
      - Use technical, robotic language.
      - JSON ONLY.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                title: { type: Type.STRING },
                action: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["id", "title", "action", "reasoning"]
            }
          }
        },
        required: ["plan"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AgentPlan;
}

export async function implementFeatures(goal: string, features: string[], apiKey: string, model: string = "gemini-3-flash-preview"): Promise<FeatureImplementation[]> {
  const ai = getAI(apiKey);
  const response = await ai.models.generateContent({
    model,
    contents: `Goal: ${goal}\nFeatures to implement: ${features.join(', ')}`,
    config: {
      systemInstruction: `You are a High-Precision AI System Architect. 
      For each requested feature, provide a technical implementation logic.
      
      CRITICAL REQUIREMENTS:
      1. Zero-hallucination logic
      2. High-signal extraction patterns
      3. Fail-safe redundancy
      4. Structured verification steps
      
      OUTPUT FORMAT (JSON ARRAY):
      [
        {
          "feature_name": "...",
          "implementation_steps": [
            {
              "step_number": 1,
              "description": "...",
              "example": "Technical logic/regex/pattern",
              "follow_up": "Verification method"
            }
          ],
          "expected_output": "Technical verification string"
        }
      ]`,
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("No output generated");
  return JSON.parse(text) as FeatureImplementation[];
}

export async function executeMission(goal: string, plan: AgentPlan, apiKey: string, model: string = "gemini-3-flash-preview"): Promise<string> {
  const ai = getAI(apiKey);
  const response = await ai.models.generateContent({
    model,
    contents: `Mission Goal: ${goal}\n\nPlan:\n${plan.plan.map(s => `${s.id}. ${s.title}: ${s.action}`).join('\n')}`,
    config: {
      systemInstruction: `You are a High-Precision Execution System. 
      Execute the mission and provide the final structured intelligence in JSON format.
      
      JSON OUTPUT FORMAT (STRICT):
      {
        "videos_processed": [
          {
            "title": "Video Title",
            "url": "https://youtube.com/watch?v=...",
            "transcript_quality": "high | medium | low",
            "tools_detected": ["Tool A", "Tool B"]
          }
        ],
        "top_ai_tools": [
          {
            "rank": 1,
            "name": "ChatGPT",
            "video_mentions": 8,
            "total_mentions": 42,
            "confidence": "high",
            "context": "Used for content generation and coding assistance."
          }
        ],
        "pdf_file": "ai_tools_report.pdf"
      }
      
      RULES:
      - ANALYZE ALL RELEVANT VIDEOS FROM THE SOURCE.
      - RANK TOOLS/ITEMS ACCORDING TO THE SCALE REQUESTED IN THE GOAL (e.g. if goal asks for top 100, rank 100).
      - NO HALLUCINATIONS.
      - JSON ONLY.`,
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("No output generated");
  return text;
}
