'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/appointments?all=true");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, status) {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      
      if (!res.ok) throw new Error("Failed to update appointment");
      
      // Refresh appointments after update
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  }

  if (loading) {
    return <div className="container-padded py-5 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container-padded py-5" style={{maxWidth:'50rem'}}>
      <h1 className="page-title">Randevu Yönetimi</h1>
      {appointments.length === 0 && <p className="text-center text-muted">Hiç randevu yok.</p>}
      <div className="d-flex flex-column gap-4">
        {appointments.map((a) => (
          <div key={a.id} className="card shadow-sm border-0">
            <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <div className="fw-bold" style={{fontSize:'1.15rem', color:'#7c3aed', letterSpacing:'0.5px'}}>
                  {a.barber.name}
                </div>
                <div className="text-muted small mb-1">{a.service.name}</div>
                <div className="text-dark small">{new Date(a.date).toLocaleString("tr-TR")}</div>
                <div className="text-muted small">Kullanıcı: {a.user.name} ({a.user.email})</div>
              </div>
              <div className="d-flex flex-column align-items-end gap-2">
                <span className={`badge px-3 py-2 ${a.status === 'PENDING' ? 'bg-warning text-dark' : a.status === 'CANCELLED' ? 'bg-danger' : a.status === 'CONFIRMED' ? 'bg-success' : 'bg-secondary'}`}
                  style={{fontSize:'0.95rem', letterSpacing:'0.5px', minWidth:'90px', textAlign:'center'}}>
                  {a.status === 'PENDING' ? 'Bekliyor' : a.status === 'CANCELLED' ? 'İptal' : a.status === 'CONFIRMED' ? 'Onaylandı' : 'Tamamlandı'}
                </span>
                {a.status === 'PENDING' && (
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleAction(a.id, 'CONFIRMED')}
                      className="btn btn-success btn-sm"
                    >
                      Onayla
                    </button>
                    <button 
                      onClick={() => handleAction(a.id, 'CANCELLED')}
                      className="btn btn-danger btn-sm"
                    >
                      İptal Et
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 