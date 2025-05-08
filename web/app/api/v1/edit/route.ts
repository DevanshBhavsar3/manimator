import { client } from "@/db";
import { getCode, uploadToCloudStorage } from "@/utils/gcs";
import { createContext, RESPONSE_SCHEMA, SYSTEM_PROMPT } from "@/utils/prompt";
import { triggerRunnerJob } from "@/utils/triggerJob";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthrized." });
    }

    const { prompt, projectId } = await req.json();

    const project = await client.project.findFirst({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!project) {
      return NextResponse.json({ msg: "Invalid Project." });
    }

    const prevMessages = await client.message.findMany({
      where: {
        projectId: project.id,
      },
      select: {
        id: true,
        content: true,
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const newMessage = await client.message.create({
      data: {
        projectId: project.id,
        content: prompt,
        sender: "User",
      },
      select: {
        id: true,
        content: true,
        projectId: true,
        createdAt: true,
        sender: true,
      },
    });

    console.log(prevMessages);

    // Get the last message (most recent)
    const versionId = prevMessages[0].id;

    const lastCode = await getCode(projectId, versionId.toString());

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        systemInstruction: createContext(prevMessages, lastCode),
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    console.log(createContext(prevMessages, lastCode));

    const aiResponse = response.text;
    const { code, scene_name } = JSON.parse(aiResponse as string);

    // Upload the code & render for the new animation
    await uploadToCloudStorage(code, project.id, newMessage.id);
    await triggerRunnerJob(project.id, newMessage.id.toString(), scene_name);

    return NextResponse.json({ message: newMessage });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "Error " });
  }
}
