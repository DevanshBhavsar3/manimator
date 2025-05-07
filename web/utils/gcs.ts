import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: `${process.cwd()}/credentials/gcs_credentials.json`,
});

export async function uploadToCloudStorage(code: string, projectId: string) {
  try {
    const gcs = storage.bucket("code-video-bucket");
    const filename = `${projectId}/main.py`;
    const file = gcs.file(filename);

    await file.save(code, {
      predefinedAcl: "publicRead",
      metadata: {
        contentType: "application/x-python-code",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
}

export async function getVideo(projectId: string) {
  try {
    const gcs = storage.bucket("code-video-bucket");
    const filename = `${projectId}/animation.mp4`;
    const file = gcs.file(filename);

    const [isExists] = await file.exists();

    console.log("EXIST", isExists);

    if (!isExists) {
      return "Video not found.";
    }

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });

    console.log(url);
    return url;
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
}
