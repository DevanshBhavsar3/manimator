"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Send } from "lucide-react";
import { Sender } from "@prisma/client";

interface Message {
  id: number;
  content: string;
  projectId: string;
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

// TODO: Add a feture to edit existing code
export default function ProjectPage({ project }: ProjectPageProps) {
  const promptRef = useRef("");
  const [messages, setMessages] = useState<Message[]>(project.messages);
  const [video, setVideo] = useState("");

  console.log(project);

  useEffect(() => {
    if (video) return;

    async function fetchData() {
      const response = await fetch("http://localhost:3000/api/v1/video", {
        method: "POST",
        body: JSON.stringify({
          projectId: project.id,
        }),
      });
      const data = await response.json();

      if ((data.result as string).startsWith("http")) {
        setVideo(data.result);
      }
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [video]);

  async function sendPrompt() {
    const response = await fetch("http://localhost:3000/api/v1/edit", {
      method: "POST",
      body: JSON.stringify({
        prompt: promptRef.current,
      }),
    });
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
          <textarea
            className="px-4 py-2 rounded-xl bg-neutral-700 border border-neutral-500 w-full h-full outline-none resize-none text-neutral-100 text-lg"
            placeholder={"Please change the color to white."}
            onChange={(e) => {
              promptRef.current = e.target.value;
            }}
          />
          <Button
            onClick={sendPrompt}
            variant="primary"
            className="absolute right-3 bottom-2 rounded-xl"
          >
            <Send size={24} className="m-2 text-black" />
          </Button>
        </div>
      </div>
      <div className="w-full min-h-screen flex flex-col justify-between items-center">
        <div className="w-full bg-neutral-700 py-2 px-4 border-b border-neutral-500">
          <h1 className="text-md font-bold">{project.name}</h1>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          {video ? (
            <iframe src={video} className="w-full h-full"></iframe>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
              <span>Rendering...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
