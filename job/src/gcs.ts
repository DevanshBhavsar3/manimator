import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

const storage = new Storage({
  keyFilename: `${process.cwd()}/credentials/gcs_credentials.json`,
});

export async function downloadFile(projectId: string, versionId: string) {
  const bucketName = "code-video-bucket";
  const fileName = `${projectId}/${versionId}/main.py`;

  await storage
    .bucket(bucketName as string)
    .file(fileName as string)
    .download({
      destination: `${process.cwd()}/scripts/main.py`,
    });
}

export async function uploadVideo(
  projectId: string,
  versionId: string,
  videoPath: string
) {
  const gcs = storage.bucket("code-video-bucket");

  const storagepath = `${projectId}/${versionId}/animation.mp4`;

  await gcs.upload(videoPath, {
    destination: storagepath,
    predefinedAcl: "publicRead",
    metadata: {
      contentType: "video/mp4",
    },
  });
}
