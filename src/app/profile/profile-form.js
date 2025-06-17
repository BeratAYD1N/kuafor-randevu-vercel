"use client";

import { useState } from "react";

export default function ProfileForm({ user }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password: password || undefined }),
    });
    if (res.ok) {
      setMessage("Profil güncellendi!");
      setPassword("");
    } else {
      setError("Bir hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="alert alert-success py-2">{message}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="mb-3">
        <label className="form-label">İsim</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Yeni Şifre (isteğe bağlı)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Yeni şifre bırakılırsa değişmez"
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Kaydet</button>
    </form>
  );
} 