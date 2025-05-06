import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { uploadToCloudStorage } from "../../../../utils/uploadToStorage";
import { v4 } from "uuid";
import { triggerRunnerJob } from "@/utils/triggerJob";
import { RESPONSE_SCHEMA, SYSTEM_PROMPT } from "@/utils/prompt";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const prompt = data.prompt;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const aiResponse = response.text;
    const parsedResponse = JSON.parse(aiResponse as string);

    const code = parsedResponse.code;
    const scene_name = parsedResponse.scene_name;

    console.log(code);
    console.log(scene_name);

    const uid = v4();
    const link = await uploadToCloudStorage(code, uid);

    const videoUrl = await triggerRunnerJob(link, scene_name);

    console.log(videoUrl);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "Error " });
  }
}
