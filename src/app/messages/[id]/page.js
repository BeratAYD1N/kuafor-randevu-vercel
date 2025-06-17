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
    <div className="container-padded py-4 d-flex flex-column align-items-center" style={{maxWidth:'38rem', minHeight:'80vh'}}>
      <div className="card shadow w-100 d-flex flex-column flex-grow-1" style={{minHeight:'60vh'}}>
        <div className="card-body overflow-auto px-3 py-4" style={{height:'60vh'}}>
          <div className="d-flex flex-column gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.senderId === id
                    ? "align-self-end bg-light border rounded-pill px-4 py-2 text-dark"
                    : "align-self-start text-white rounded-pill px-4 py-2"
                }
                style={
                  m.senderId === id
                    ? {maxWidth:'75%', wordBreak:'break-word'}
                    : {maxWidth:'75%', wordBreak:'break-word', background:'#7c3aed'}
                }
              >
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <form onSubmit={send} className="card-footer bg-white border-0 d-flex gap-2 align-items-center sticky-bottom p-3">
          <input
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mesaj yaz..."
          />
          <button className="btn" type="submit" style={{background:'#7c3aed', color:'#fff'}}>Gönder</button>
        </form>
      </div>
    </div>
  );
} 