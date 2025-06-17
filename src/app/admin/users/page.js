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
    <div className="admin-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="admin-card mx-auto">
        <h1 className="page-title">Kullanıcılar</h1>
        {users.map((u) => (
          <div key={u.id} className="admin-user-card d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-semibold mb-1">{u.name}</p>
              <p className="text-muted small mb-0">{u.email}</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <span className="badge bg-light text-primary border border-primary px-2 py-1">{u.role}</span>
              <button
                onClick={() => toggleRole(u.id, u.role)}
                className="btn btn-outline-purple btn-sm"
              >
                Rolü Değiştir
              </button>
              <button
                onClick={() => del(u.id)}
                className="btn btn-danger btn-sm"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && <p>Hiç kullanıcı yok.</p>}
      </div>
    </div>
  );
} 