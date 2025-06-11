"use client";

import { useState } from "react";

export default function ProfileForm({ user }) {
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setMessage("Güncellendi!");
    } else {
      setMessage("Hata");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <p className="text-green-600">{message}</p>}
      <div>
        <label className="block mb-1">İsim</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Kaydet
      </button>
    </form>
  );
} 