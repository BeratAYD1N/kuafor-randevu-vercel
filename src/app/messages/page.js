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
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mesajlaşma</h1>
      {users.map((u) => (
        <Link
          key={u.id}
          href={`/messages/${u.id}`}
          className="block border rounded px-4 py-2 hover:bg-gray-100"
        >
          {u.name} ({u.email})
        </Link>
      ))}
      {users.length === 0 && <p>Başka kullanıcı yok.</p>}
    </div>
  );
} 