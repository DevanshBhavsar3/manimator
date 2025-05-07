import dotenv from "dotenv";
dotenv.config();
import { uploadVideo } from "./gcs";

const { PROJECT_ID, SCENE_NAME } = process.env;

async function main() {
  try {
    if (!PROJECT_ID) return;

    // Upload the rendered video to GCS
    await uploadVideo(
      PROJECT_ID,
      `${process.cwd()}/media/videos/main/1080p60/${SCENE_NAME}.mp4`
    );
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
