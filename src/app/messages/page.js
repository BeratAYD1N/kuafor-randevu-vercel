"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MessagesHome() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="container-padded py-5" style={{maxWidth:'32rem'}}>
      <h1 className="page-title">Mesajlaşma</h1>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {users.map((u) => (
          <Link
            key={u.id}
            href={`/messages/${u.id}`}
            className="card px-3 py-2 text-decoration-none shadow-sm align-items-center d-flex flex-row gap-3"
            style={{minWidth:'220px', maxWidth:'320px'}}
          >
            <div className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center" style={{width:40, height:40, fontSize:20, color:'var(--primary)'}}>
              {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold text-dark">{u.name}</div>
              <div className="text-muted small">{u.email}</div>
            </div>
          </Link>
        ))}
      </div>
      {users.length === 0 && <p className="text-center text-muted mt-4">Başka kullanıcı yok.</p>}
    </div>
  );
} 