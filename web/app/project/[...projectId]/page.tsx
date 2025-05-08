import ProjectPage from "@/components/pages/Project";
import { client } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Project({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const projectId = (await params).projectId[0];

  const project = await client.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    select: {
      id: true,
      createdAt: true,
      messages: true,
      name: true,
    },
  });

  if (!project) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <p>Inavlid Project</p>
      </div>
    );
  }

  return <ProjectPage project={project} />;
}
