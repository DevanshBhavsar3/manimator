import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { uploadToCloudStorage } from "../../../../utils/gcs";
import { triggerRunnerJob } from "@/utils/triggerJob";
import { RESPONSE_SCHEMA, SYSTEM_PROMPT } from "@/utils/prompt";
import { client } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthrized." });
    }

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
    const { code, scene_name, project_name } = JSON.parse(aiResponse as string);

    const project = await client.project.create({
      data: {
        name: project_name || scene_name,
        userId,
      },
      select: {
        id: true,
      },
    });

    await client.message.create({
      data: {
        projectId: project.id,
        content: prompt,
        sender: "User",
      },
    });

    await uploadToCloudStorage(code, project.id);

    await triggerRunnerJob(project.id, scene_name);

    return NextResponse.json({ projectId: project.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "Error " });
  }
}
