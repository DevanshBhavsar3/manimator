import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "",
  credentials: {
    type: "service_account",
    project_id: process.env.GCS_PROJECT_ID,
    private_key_id: process.env.GCS_PRIVATE_KEY_ID,
    private_key: process.env.GCS_PRIVATE_KEY,
    client_email: process.env.GCS_CLIENT_EMAIL,
    client_id: process.env.GCS_CLIENT_ID,
  },
});

export async function uploadToCloudStorage(code: string, uid: string) {
  try {
    const gcs = storage.bucket("code-video-bucket");
    const filename = `code/${uid}/main.py`;
    const file = gcs.file(filename);

    await file.save(code, {
      predefinedAcl: "publicRead",
      metadata: {
        contentType: "application/x-python-code",
      },
    });

    return file.cloudStorageURI.href;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}
