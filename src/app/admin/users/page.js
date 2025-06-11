"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Yetki yok");
        return res.json();
      })
      .then(setUsers)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (id, current) => {
    const newRole = current === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, role: newRole }),
    });
    if (res.ok) load();
  };

  const del = async (id) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Kullanıcılar</h1>
      {users.map((u) => (
        <div key={u.id} className="border rounded p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-sm text-gray-600">{u.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm">{u.role}</span>
            <button
              onClick={() => toggleRole(u.id, u.role)}
              className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
            >
              Rolü Değiştir
            </button>
            <button
              onClick={() => del(u.id)}
              className="px-2 py-1 bg-red-600 text-white rounded text-xs"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
      {users.length === 0 && <p>Hiç kullanıcı yok.</p>}
    </div>
  );
} 