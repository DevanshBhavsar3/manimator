import { JobsClient } from "@google-cloud/run";

const runClient = new JobsClient({
  keyFilename: `${process.cwd()}/credentials/gcs_credentials.json`,
});

export async function triggerRunnerJob(projectId: string, sceneName: string) {
  const request = {
    name: "projects/manim-generator/locations/asia-south1/jobs/manim-generator",
    overrides: {
      containerOverrides: [
        {
          env: [
            {
              name: "PROJECT_ID",
              value: projectId,
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

  await runClient.runJob(request);
}
