import { downloadFile } from "./gcs";

const { SCRIPT_URL } = process.env;

async function main() {
  try {
    if (!SCRIPT_URL) return;

    // Download the script file from GCS
    await downloadFile(SCRIPT_URL);
  } catch (e) {
    console.error(e);
    throw new Error(e as unknown as string);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
