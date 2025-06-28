"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewAppointmentPage() {
  const searchParams = useSearchParams();
  const barberId = searchParams.get("barber");
  const router = useRouter();

  const [barber, setBarber] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (barberId) {
      fetch(`/api/barbers`) // will fetch all, could optimize
        .then((res) => res.json())
        .then((data) => {
          const b = data.find((x) => x.id === barberId);
          setBarber(b);
          if (b && b.services.length) setServiceId(b.services[0].id);
        });
    }
  }, [barberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barberId, serviceId, date }),
      });
      if (res.ok) {
        router.push("/appointments");
      } else {
        const d = await res.text();
        setError(d || "Hata oluştu");
      }
    } catch (err) {
      console.error(err);
      setError("Sunucu hatası");
    }
  };

  if (status === "loading") return <p className="p-6">Yükleniyor...</p>;
  if (status === "unauthenticated" || !session) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="admin-card mx-auto text-center p-5" style={{maxWidth:'26rem'}}>
          <div style={{fontSize:'3rem', color:'#a78bfa', marginBottom:'0.5rem'}}>
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#faf5ff" stroke="#a78bfa" strokeWidth="2"/><path d="M24 14v10" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/><circle cx="24" cy="32" r="2.2" fill="#a78bfa"/></svg>
          </div>
          <h1 className="page-title mb-2">Yetkisiz İşlem</h1>
          <p className="text-danger fw-semibold mb-4" style={{fontSize:'1.1rem'}}>Randevu almak için önce giriş yapmalısınız.</p>
          <a href="/login" className="btn btn-outline-purple btn-lg rounded-pill px-5">Giriş Yap</a>
        </div>
      </div>
    );
  }

  if (!barber) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="admin-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="admin-card mx-auto" style={{maxWidth:'32rem'}}>
        <h1 className="page-title mb-4">Randevu Al - {barber.name}</h1>
        {error && <p className="text-danger text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="mb-0">
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Hizmet</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="form-control"
            >
              {barber.services.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} - ₺{srv.price}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold">Tarih ve Saat</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-purple w-100">Randevu Oluştur</button>
        </form>
      </div>
    </div>
  );
} 