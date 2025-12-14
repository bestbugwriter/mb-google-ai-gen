import { GoogleGenAI, Type } from "@google/genai";
import { Story, StoryPage } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the story structure (text and image prompts) based on user input.
 * Uses gemini-3-pro-preview for high logic and creativity.
 */
export const generateStoryStructure = async (
  childName: string,
  gender: string,
  description: string,
  style: string,
  pageCount: number
): Promise<Story> => {
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    You are a world-class children's book author and illustrator art director.
    
    Task: Create a short, engaging, and educational storybook based on a child's real-day activity.
    
    Child's Name: ${childName}
    Gender: ${gender}
    Activity/Event: "${description}"
    Visual Style: ${style} (e.g., watercolor, 3D clay, cartoon, pencil sketch)

    Requirements:
    1. The story should have a clear beginning, middle, and end.
    2. Be positive, encouraging, and easy for a child to understand.
    3. Length: Exactly ${pageCount} pages.
    4. For each page, provide the Story Text (2-3 sentences max) and a detailed Image Prompt.
    5. CRITICAL: In the Image Prompts, explicitly describe the character "${childName}" efficiently so they look consistent across all pages (e.g., "a cute little boy wearing a red hoodie"). Include the art style "${style}" in every image prompt.

    Return the result strictly as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy title for the book" },
            theme: { type: Type.STRING, description: "The visual theme or world setting" },
            moral: { type: Type.STRING, description: "The lesson or positive takeaway" },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The story text for this page" },
                  imagePrompt: { type: Type.STRING, description: "Detailed prompt for generating the illustration" },
                },
                required: ["text", "imagePrompt"]
              }
            }
          },
          required: ["title", "theme", "moral", "pages"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text returned from story generation model.");
    }

    const json = JSON.parse(response.text);
    
    // Map to our internal type and add page numbers
    const story: Story = {
      title: json.title,
      theme: json.theme,
      moral: json.moral,
      pages: json.pages.map((p: any, index: number) => ({
        pageNumber: index + 1,
        text: p.text,
        imagePrompt: p.imagePrompt,
        isLoadingImage: true
      }))
    };

    return story;

  } catch (error) {
    console.error("Story Generation Error:", error);
    throw error;
  }
};

/**
 * Generates an illustration for a specific page using Gemini Nano Banana (Flash Image).
 */
export const generatePageImage = async (imagePrompt: string): Promise<string> => {
  // Mapping "NanoBanana" to 'gemini-2.5-flash-image' as per instructions for general image generation
  const modelId = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
        // Nano banana (flash image) does not support outputMimeType or schema
        // It returns inline data
      }
    });

    // Extract base64 image from the response parts
    // We iterate to find the inlineData part
    let base64Image = "";
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!base64Image) {
        // Fallback or error handling if no image is found
        // Sometimes models return text saying "I cannot generate..."
        console.warn("No inline image data found in response parts.");
        throw new Error("Failed to generate visual content.");
    }

    return base64Image;

  } catch (error) {
    console.error("Image Generation Error:", error);
    // Return a placeholder or re-throw depending on desired UX. 
    // Re-throwing allows the UI to show an error state for that specific card.
    throw error;
  }
};
