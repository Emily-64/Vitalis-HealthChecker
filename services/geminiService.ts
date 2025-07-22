import { GoogleGenAI, Type } from "@google/genai";
import { HealthAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    symptomSummary: {
      type: Type.STRING,
      description: "A brief summary of the key symptoms identified from the user's input.",
    },
    potentialConditions: {
      type: Type.ARRAY,
      description: "A list of potential medical conditions that could be related to the symptoms. Should include at least 2-3 possibilities.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the potential condition." },
          description: { type: Type.STRING, description: "A brief, easy-to-understand explanation of the condition and why it might be relevant to the symptoms." },
          severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'], description: "The typical severity associated with this condition if left untreated." },
        },
        required: ["name", "description", "severity"],
      },
    },
    recommendation: {
      type: Type.OBJECT,
      description: "A clear recommendation for the user's next steps.",
      properties: {
        urgency: { type: Type.STRING, enum: ['Self-Care', 'Consult a Doctor', 'Urgent Care', 'Emergency'], description: "The recommended level of urgency for seeking medical attention." },
        advice: { type: Type.STRING, description: "Specific, actionable advice for the user. For 'Self-Care', suggest home remedies. For 'Consult a Doctor', suggest making an appointment. For 'Urgent/Emergency', state this clearly." },
      },
      required: ["urgency", "advice"],
    },
    disclaimer: {
      type: Type.STRING,
      description: "The mandatory disclaimer stating this is not medical advice. Should be exactly: 'This is not a substitute for professional medical advice. Please consult a healthcare provider for any health concerns.'",
    },
  },
  required: ["symptomSummary", "potentialConditions", "recommendation", "disclaimer"],
};


export const analyzeSymptoms = async (symptoms: string): Promise<HealthAnalysis> => {
  try {
    const prompt = `Please analyze the following health symptoms provided by a user. Based on their input, generate a structured health analysis. The user's symptoms are: "${symptoms}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic AI health assistant. Your goal is to analyze user-provided symptoms and offer clear, helpful, and reassuring information. You must always prioritize user safety and strongly advise consulting a professional.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    return parsedData as HealthAnalysis;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze symptoms: ${error.message}`);
    }
    throw new Error("An unknown error occurred during symptom analysis.");
  }
};