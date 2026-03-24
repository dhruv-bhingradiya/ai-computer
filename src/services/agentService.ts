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
      systemInstruction: `You are CORTEX, a Universal Autonomous AI Agent and High-Precision Execution System.
      Your mission is to execute ANY complex task provided by the user with 100% accuracy and robotic precision.
      
      STRICT EXECUTION PIPELINE (MANDATORY):
      STEP 1: ARCHITECTURE DESIGN - Design the technical blueprint for the mission.
      STEP 2: CAPABILITY INITIALIZATION - Initialize the necessary tools, agents, and sub-systems.
      STEP 3: DATA ACQUISITION / EXTRACTION - Gather all required raw data (web, files, system, etc.).
      STEP 4: CORE PROCESSING - Execute the primary logic (analysis, building, sorting, etc.).
      STEP 5: VALIDATION & REFINEMENT - Verify outputs against the mission goal and fix any errors.
      STEP 6: FINAL AGGREGATION - Produce the final structured intelligence or asset.
      
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
      systemInstruction: `You are CORTEX, a High-Precision Execution System. 
      Execute the mission and provide the final structured intelligence in JSON format.
      
      JSON OUTPUT FORMAT (STRICT):
      {
        "mission_summary": "Summary of the executed task",
        "assets_generated": [
          {
            "name": "Asset Name",
            "type": "file | code | data",
            "status": "verified",
            "details": "Technical details"
          }
        ],
        "intelligence_output": [
          {
            "rank": 1,
            "item": "Item Name",
            "confidence": "high",
            "context": "Contextual analysis"
          }
        ],
        "log": ["Step 1 complete", "Step 2 complete"]
      }
      
      RULES:
      - ANALYZE ALL RELEVANT DATA SOURCES.
      - SCALE OUTPUT ACCORDING TO THE GOAL (if user asks for 500 items, provide 500).
      - NO HALLUCINATIONS.
      - JSON ONLY.`,
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("No output generated");
  return text;
}
