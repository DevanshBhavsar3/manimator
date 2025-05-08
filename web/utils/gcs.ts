import { VersionContent } from "@/types";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: `${process.cwd()}/credentials/gcs_credentials.json`,
});

export async function uploadToCloudStorage(
  code: string,
  projectId: string,
  version: number
) {
  try {
    const gcs = storage.bucket("code-video-bucket");
    const filename = `${projectId}/${version}/main.py`;
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

export async function getCode(projectId: string, versionId: string) {
  try {
    const gcs = storage.bucket("code-video-bucket");
    const filename = `${projectId}/${versionId}/main.py`;
    const file = gcs.file(filename);

    // const [isExists] = await file.exists();

    // console.log("EXIST", isExists);

    // if (!isExists) {
    //   return;
    // }

    return new Promise<string>((resolve, reject) => {
      let code = Buffer.from("");

      file
        .createReadStream()
        .on("error", (err) => {
          console.error("Stream error:", err);
          reject(err);
        })
        .on("data", (chunk) => {
          code = Buffer.concat([code, chunk]);
        })
        .on("end", () => {
          resolve(code.toString("utf-8"));
        });
    });
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
}

export async function getContent(filter: string): Promise<VersionContent[]> {
  try {
    const gcs = storage.bucket("code-video-bucket");
    const prefix = `${filter}/`;
    const [files] = await gcs.getFiles({ prefix });

    const versionMap = new Map<string, VersionContent>();

    await Promise.all(
      files.map(async (file) => {
        const filePath = file.name;
        const parts = filePath.split("/");

        if (parts.length < 3) return;

        const version = parts[1];
        const fileName = parts[2];

        if (!versionMap.has(version)) {
          versionMap.set(version, { version });
        }

        if (fileName === "main.py") {
          const code = await new Promise<string>((resolve, reject) => {
            let buffer = Buffer.from("");

            file
              .createReadStream()
              .on("error", reject)
              .on("data", (chunk) => {
                buffer = Buffer.concat([buffer, chunk]);
              })
              .on("end", () => {
                resolve(buffer.toString("utf-8"));
              });
          });

          versionMap.get(version)!.code = code;
        } else if (fileName === "animation.mp4") {
          const [url] = await file.getSignedUrl({
            action: "read",
            expires: Date.now() + 60 * 60 * 1000,
          });

          versionMap.get(version)!.videoUrl = url;
        }
      })
    );

    return Array.from(versionMap.values()).sort(
      (a, b) => parseInt(b.version) - parseInt(a.version)
    );
  } catch (e) {
    console.error(e);
    throw new Error(e as string);
  }
}
