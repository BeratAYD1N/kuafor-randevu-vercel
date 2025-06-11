"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef(null);

  const load = () => {
    fetch(`/api/messages?with=${id}`)
      .then((res) => res.json())
      .then(setMessages);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: id, content }),
    });
    if (res.ok) {
      setContent("");
      load();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto space-y-2 border p-4 rounded">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`px-3 py-2 rounded w-fit ${m.senderId === id ? "bg-gray-200 ml-auto" : "bg-blue-600 text-white"}`}
          >
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Gönder</button>
      </form>
    </div>
  );
} 