import { downloadFile } from "./gcs";

const { PROJECT_ID } = process.env;

async function main() {
  try {
    if (!PROJECT_ID) return;

    // Download the script file from GCS
    await downloadFile(PROJECT_ID);
  } catch (e) {
    console.error(e);
    throw new Error(e as unknown as string);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
