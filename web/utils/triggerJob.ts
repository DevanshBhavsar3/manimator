import { JobsClient } from "@google-cloud/run";

const runClient = new JobsClient({
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

export async function triggerRunnerJob(scriptURL: string, sceneName: string) {
  const request = {
    name: "projects/manim-generator/locations/asia-south1/jobs/manim-generator",
    overrides: {
      containerOverrides: [
        {
          env: [
            {
              name: "SCRIPT_URL",
              value: scriptURL,
            },
            {
              name: "SCENE_NAME",
              value: sceneName,
            },
          ],
        },
      ],
    },
  };

  const [operation] = await runClient.runJob(request);
  const [response] = await operation.promise();

  console.log(response);
}
