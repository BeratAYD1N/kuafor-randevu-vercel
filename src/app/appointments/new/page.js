"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function NewAppointmentPage() {
  const searchParams = useSearchParams();
  const barberId = searchParams.get("barber");
  const router = useRouter();

  const [barber, setBarber] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

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

  if (!barber) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Randevu Al - {barber.name}</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Hizmet</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {barber.services.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name} - ₺{srv.price}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Tarih ve Saat</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Randevu Oluştur
        </button>
      </form>
    </div>
  );
} 