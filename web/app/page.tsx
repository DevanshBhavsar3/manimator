"use client";

import { Button } from "@/components/ui/Button";
import { PromptArea } from "@/components/ui/PromptArea";
import { RedirectToSignIn, SignIn, useAuth } from "@clerk/nextjs";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function Home() {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const promptRef = useRef("");

  async function sendPrompt() {
    if (!auth.userId) {
      setRedirect(true);
      return;
    }

    setLoading(true);

    const response = await fetch("http://localhost:3000/api/v1/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: promptRef.current,
      }),
    });
    const data = await response.json();

    router.push(`/project/${data.projectId}`);
    setLoading(false);
  }

  return (
    <div className="w-full bg-zinc-900 min-h-screen flex flex-col justify-center items-center p-4 gap-5">
      <h1 className="text-3xl font-serif">Manimator</h1>
      <div className="w-1/2 h-32 relative">
        <PromptArea
          loading={loading}
          onSubmit={sendPrompt}
          promptRef={promptRef}
        />
      </div>
      {redirect && <RedirectToSignIn />}
    </div>
  );
}
