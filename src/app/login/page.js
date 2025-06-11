"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Giriş başarısız");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-4" style={{background:'#faf5ff'}}>
      <form onSubmit={handleSubmit} style={{maxWidth:'28rem'}} className="w-100 bg-white shadow rounded-3 p-4">
        <h1 className="h3 fw-bold text-center mb-4">Giriş Yap</h1>
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Şifre</label>
          <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">Giriş</button>
      </form>
    </div>
  );
} 