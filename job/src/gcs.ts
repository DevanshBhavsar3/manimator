import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

const storage = new Storage({
  keyFilename: `${process.cwd()}/credentials/gcs_credentials.json`,
});

export async function downloadFile(gsuri: string) {
  const [bucketName, ...filepath] = gsuri.slice("gs://".length).split("/");
  const fileName = filepath.join("/");

  await storage
    .bucket(bucketName as string)
    .file(fileName as string)
    .download({
      destination: `${process.cwd()}/scripts/main.py`,
    });
}

export async function uploadVideo(scriptUri: string, videoPath: string) {
  const gcs = storage.bucket("code-video-bucket");

  const splitUrl = scriptUri.split("/");
  const storagepath = `${splitUrl[3]}/${splitUrl[4]}/animation.mp4`;

  const result = await gcs.upload(videoPath, {
    destination: storagepath,
    predefinedAcl: "publicRead",
    metadata: {
      contentType: "video/mp4",
    },
  });

  return result[0].publicUrl();
}
