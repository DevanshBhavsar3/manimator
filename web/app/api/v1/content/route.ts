import { getContent } from "@/utils/gcs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filter } = await req.json();

    const content = await getContent(filter);

    return NextResponse.json({ content });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "Error " });
  }
}
