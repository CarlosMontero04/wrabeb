import { GoogleGenAI, Type } from "@google/genai";
import { DrinkRecord, DrinkType, GemniAnalysisResult } from '../types';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeDrinkingHabits = async (drinks: DrinkRecord[]): Promise<GemniAnalysisResult> => {
  if (!ai) {
    return {
      message: "⚠️ Falta la API Key. No puedo juzgarte (aún).",
      tone: 'warning'
    };
  }

  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentDrinks = drinks.filter(d => d.timestamp > thirtyDaysAgo);

  const stats = {
    total: recentDrinks.length,
    chupitos: recentDrinks.filter(d => d.type === DrinkType.CHUPITO).length,
    cervezas: recentDrinks.filter(d => d.type === DrinkType.CERVEZA).length,
    cubatas: recentDrinks.filter(d => d.type === DrinkType.CUBATA).length,
  };

  const prompt = `
    Eres un 'Party Planner' sarcástico y divertido.
    Estadísticas del usuario (últimos 30 días):
    Total: ${stats.total}
    🥃 Chupitos: ${stats.chupitos}
    🍺 Cervezas: ${stats.cervezas}
    🍹 Cubatas: ${stats.cubatas}

    Dame una opinión muy breve (máx 20 palabras) sobre estos números.
    Usa emojis. Sé gracioso.
    Si bebe mucho, usa un tono 'warning' pero gracioso (ej: "Tu hígado pide auxilio 🆘").
    Si bebe poco, usa tono 'fun' o 'serious' (ej: "Estás muy tranquilo, ¿todo bien? 🤔").
    
    Output JSON: { "message": string, "tone": "fun" | "serious" | "warning" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            tone: { type: Type.STRING, enum: ['fun', 'serious', 'warning'] }
          },
          required: ['message', 'tone']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GemniAnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: "😴 La IA se ha ido de fiesta. Inténtalo luego.",
      tone: 'fun'
    };
  }
};