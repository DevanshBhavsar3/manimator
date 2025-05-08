"use client";

import { useEffect, useRef, useState } from "react";
import { Sender } from "@prisma/client";
import { PromptArea } from "../ui/PromptArea";
import { VersionContent } from "@/types";

interface Message {
  id: number;
  content: string;
  projectId: string;
  createdAt: Date;
  sender: Sender;
}

interface ProjectPageProps {
  project: {
    id: string;
    createdAt: Date;
    messages: Message[];
    name: string;
  };
}

export default function ProjectPage({ project }: ProjectPageProps) {
  const promptRef = useRef("");
  const [tab, setTab] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>(project.messages);
  const [content, setContent] = useState<VersionContent[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionContent | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContent(project.id);
  }, []);

  async function fetchContent(filter: string) {
    try {
      const response = await fetch("http://localhost:3000/api/v1/content", {
        method: "POST",
        body: JSON.stringify({
          filter,
        }),
      });

      const data = await response.json();

      if (data.content && data.content.length > 0) {
        setContent(data.content);
        setSelectedVersion(data.content[0]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function sendPrompt() {
    setLoading(true);

    const response = await fetch("http://localhost:3000/api/v1/edit", {
      method: "POST",
      body: JSON.stringify({
        prompt: promptRef.current,
        projectId: project.id,
      }),
    });
    const { message: newMessage } = await response.json();

    setMessages([...messages, newMessage]);
    setLoading(false);
  }

  return (
    <div className="w-full h-full flex">
      <div className="w-1/5 h-screen text-white bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col justify-between items-start">
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-neutral-600 px-4 py-2 rounded-lg w-full text-md"
            >
              <span>{message.content}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-32 relative">
          <PromptArea
            onSubmit={sendPrompt}
            promptRef={promptRef}
            loading={loading}
          />
        </div>
      </div>
      <div className="w-full min-h-screen flex flex-col justify-between items-center">
        <div className="w-full bg-neutral-700 py-2 px-4 border-b border-neutral-500">
          <h1 className="text-md font-bold">{project.name}</h1>
        </div>
        <div className="flex w-full h-full justify-between items-center">
          <div className="w-full h-full flex flex-col justify-between items-start p-2">
            <div className="flex justify-center items-center gap-2">
              <button
                className={`px-2 py-1 text-sm cursor-pointer ${
                  tab == 0 && "border-b font-medium"
                }`}
                onClick={() => setTab(0)}
              >
                Video
              </button>
              <button
                className={`px-2 py-1 text-sm cursor-pointer ${
                  tab == 1 && "border-b font-medium"
                }`}
                onClick={() => setTab(1)}
              >
                Code
              </button>
            </div>

            {tab == 0 ? (
              selectedVersion?.videoUrl ? (
                <div className="w-full h-full flex justify-center items-center">
                  <iframe
                    src={selectedVersion.videoUrl}
                    className="w-full aspect-video border border-neutral-600 rounded-md"
                  ></iframe>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-2 w-full h-full">
                  <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                  <span>Rendering...</span>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center gap-2 w-full h-full">
                <span>{selectedVersion?.code}</span>
              </div>
            )}
          </div>
          <div className="bg-neutral-800 min-w-1/5 h-full px-4 py-2 border-l border-neutral-700 font-medium">
            <h3 className="my-5">Versions</h3>
            <div className="flex flex-col gap-2">
              {content.map((version) => (
                <iframe
                  key={version.version}
                  src={version.videoUrl}
                  className="w-full h-full rounded-md"
                ></iframe>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
