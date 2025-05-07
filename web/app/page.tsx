"use client";

import { Button } from "@/components/ui/Button";
import { RedirectToSignIn, SignIn, useAuth } from "@clerk/nextjs";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function Home() {
  const auth = useAuth();

  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const promptRef = useRef("");

  async function sendPrompt() {
    if (!auth.userId) {
      setRedirect(true);
      return;
    }

    const response = await fetch("http://localhost:3000/api/v1/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: promptRef.current,
      }),
    });
    const data = await response.json();

    router.push(`/project/${data.projectId}`);
  }

  return (
    <div className="w-full bg-zinc-900 min-h-screen flex flex-col justify-center items-center p-4 gap-5">
      <h1 className="text-3xl font-serif">Manimator</h1>
      <div className="w-1/2 h-32 relative">
        <textarea
          className="px-4 py-2 rounded-xl bg-neutral-700 border border-neutral-500 w-full h-full outline-none resize-none text-neutral-100 text-lg"
          placeholder={"What do you want to animate??"}
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
      {redirect && <RedirectToSignIn />}
    </div>
  );
}
