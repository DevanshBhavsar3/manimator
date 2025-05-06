"use client";

import React, { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [code, setCode] = useState("");

  async function sendPrompt() {
    setHistory([...history, prompt]);

    const response = await fetch("http://localhost:3000/api/v1/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    const data = await response.json();

    setCode(data.code);
  }

  return (
    <div className="bg-black text-white min-h-screen flex">
      <div className="w-1/4 bg-zinc-900 min-h-screen flex flex-col justify-between items-start p-4">
        <div className="w-full flex flex-col justify-center items-center gap-3">
          {history.map((h, index) => (
            <span key={index} className="bg-zinc-600 w-full p-2 rounded-sm">
              {h}
            </span>
          ))}
        </div>
        <div className="h-15 w-full flex justify-center items-center">
          <input
            type="text"
            className="px-4 py-2 border border-neutral-300 w-full h-full outline-none"
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={sendPrompt}
            className="bg-blue-400 text-white px-4 py-2 h-full cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
      <div className="w-full">{code && <span>{code}</span>}</div>
    </div>
  );
}
