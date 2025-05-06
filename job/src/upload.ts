import dotenv from "dotenv";
dotenv.config();
import { uploadVideo } from "./gcs";

const { SCRIPT_URL, SCENE_NAME } = process.env;

async function main() {
  try {
    if (!SCRIPT_URL) return;

    // Upload the rendered video to GCS
    const publicURL = await uploadVideo(
      SCRIPT_URL,
      `${process.cwd()}/media/videos/main/1080p60/${SCENE_NAME}.mp4`
    );

    console.log(publicURL);
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
