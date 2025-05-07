import { getVideo } from "@/utils/gcs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const project_id = data.projectId;

    const result = await getVideo(project_id);

    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "Error " });
  }
}
