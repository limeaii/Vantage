import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Initialize the client with the specific API key provided
const API_KEY = 'AIzaSyB_GbARd5JzPeXmM1VPQwKZFH9tZa5PfDE';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to generate a visual representation of the search query (General vibe)
const generatePreviewImage = async (query: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a high-quality, clean commercial product photography image of: ${query}. White background. Isolate the object.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.warn("Failed to generate preview image", error);
    return null;
  }
};

export const searchDeals = async (query: string): Promise<{ summary: string; products: Product[]; generatedImage: string | null }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Structured prompt to force JSON output in text mode (since schema + googleSearch is not allowed)
    const prompt = `
      I am looking for the cheapest specific buying options for: "${query}".
      
      Perform a Google Search to find REAL, AVAILABLE products.
      
      Output the result STRICTLY as a raw JSON object (no markdown, no backticks, no code blocks).
      The JSON must follow this exact structure:
      {
        "summary": "A brief 2-sentence analysis of the price range found.",
        "products": [
          {
            "title": "Product Name",
            "price": "$Price",
            "storeName": "Store Name",
            "url": "Direct Product URL",
            "imageUrl": "Direct Image URL (optional)",
            "description": "Short description"
          }
        ]
      }
      
      Rules for "url":
      - MUST be a direct product page (e.g. ends in .html, contains /dp/, /product/, /item/).
      - DO NOT return generic homepages (like www.amazon.com or www.ebay.com).
      - DO NOT return search result pages.
      
      Rules for "imageUrl":
      - Try to find a direct image URL for the product from the search results.
      - If you cannot find a specific image URL, leave it empty.
      
      Rules for "price":
      - specific price string (e.g. "$25.99").
      
      Ensure valid JSON syntax.
    `;

    const [searchResponse, generatedImage] = await Promise.all([
      ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // NOTE: responseMimeType and responseSchema are NOT supported when using googleSearch tool.
          // We must parse the text output manually.
        },
      }),
      generatePreviewImage(query)
    ]);

    // Parse JSON response manually
    const rawText = searchResponse.text || "{}";
    
    // Clean potential markdown code blocks (```json ... ```)
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", cleanText);
      throw new Error("Received malformed data from AI assistant.");
    }
    
    let products: Product[] = parsedData.products || [];
    const summary = parsedData.summary || "Here are the best deals we found.";

    // Strict Client-side Filtering for Garbage Links
    products = products.filter(p => {
      try {
        if (!p.url) return false;
        const url = new URL(p.url);
        // Reject root domains (e.g., https://amazon.com/)
        if (url.pathname === '/' || url.pathname.length < 2) return false;
        // Reject search pages
        if (url.pathname.includes('search') || url.searchParams.has('q')) return false;
        return true;
      } catch {
        return false;
      }
    });

    return {
      summary,
      products,
      generatedImage
    };

  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    throw new Error(error.message || "Failed to search for deals.");
  }
};