import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: {
            type: Type.STRING,
          },
          meaning: {
            type: Type.STRING,
          },
        },
        required: ["term", "meaning"],
      },
    },
    simpleExplanation: {
      type: Type.STRING,
    },
  },
  required: ["summary", "keywords", "simpleExplanation"],
};

export async function POST(request: Request) {
  try {
    let body: { notes?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    const notes = body?.notes;

    if (typeof notes !== "string" || !notes.trim()) {
      return NextResponse.json(
        { error: "Notes are required." },
        { status: 400 },
      );
    }

    if (notes.length > 20000) {
      return NextResponse.json(
        {
          error:
            "Notes are too long. Please keep them under 20,000 characters.",
        },
        { status: 400 },
      );
    }

    const prompt = `
You are an AI notes summarization assistant.

Your task is to analyze the user's notes and turn them into useful learning material.

Follow these rules carefully:

1. Create a concise bullet-point summary of the most important information.
2. Extract 5 to 10 important keywords or technical terms.
3. For every keyword, provide a short and accurate meaning.
4. Provide a beginner-friendly explanation of the notes.
5. Preserve important technical terms.
6. Do not invent facts that are not present or reasonably supported by the notes.
7. Keep the explanation simple and easy to understand.
8. If the notes contain technical concepts, explain them using simple language.
9. Return only the requested structured JSON response.

User notes:

${notes}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const text = response.text;

    if (!text) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 },
      );
    }

    let result;

    let result: unknown;

    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "The AI returned an invalid response." },
        { status: 502 },
      );
    }

    if (
      typeof result !== "object" ||
      result === null ||
      !("summary" in result) ||
      !("keywords" in result) ||
      !("simpleExplanation" in result)
    ) {
      return NextResponse.json(
        { error: "The AI response is missing required fields." },
        { status: 502 },
      );
    }

    const data = result as {
      summary: unknown;
      keywords: unknown;
      simpleExplanation: unknown;
    };

    const validSummary =
      Array.isArray(data.summary) &&
      data.summary.every((item) => typeof item === "string");

    const validKeywords =
      Array.isArray(data.keywords) &&
      data.keywords.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "term" in item &&
          typeof item.term === "string" &&
          "meaning" in item &&
          typeof item.meaning === "string",
      );

    const validExplanation = typeof data.simpleExplanation === "string";

    if (!validSummary || !validKeywords || !validExplanation) {
      return NextResponse.json(
        { error: "The AI response has an invalid structure." },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Summarization error:", error);

    const message = error instanceof Error ? error.message : "";

    if (
      message.toLowerCase().includes("prepayment credits") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("402")
    ) {
      return NextResponse.json(
        {
          error:
            "The AI service has no available credits. Please check your AI provider's billing and quota.",
        },
        { status: 402 },
      );
    }

    return NextResponse.json(
      { error: "Summarization failed. Please try again later." },
      { status: 500 },
    );
  }
}
