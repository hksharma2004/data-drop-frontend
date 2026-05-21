const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "openrouter/owl-alpha";

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function generateJsonWithOpenRouter(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("AI service is not configured.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Title": "DataDrop",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content: "Return only valid JSON. Do not include markdown or explanatory text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 800,
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("OpenRouter API request failed:", response.status, errorBody);
    throw new Error(`AI generation failed. Status: ${response.status}`);
  }

  const result = (await response.json()) as OpenRouterResponse;
  const generatedText = result.choices?.[0]?.message?.content;

  if (!generatedText) {
    throw new Error("AI generation returned an empty response.");
  }

  return generatedText.replace(/```json\n?|```/g, "").trim();
}
