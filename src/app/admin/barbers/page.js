"use client";
import { useEffect, useState } from "react";

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([{ name: "", price: "", duration: "" }]);

  const load = () => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then(setBarbers);
  };

  useEffect(() => {
    load();
  }, []);

  const addServiceRow = () => {
    setServices([...services, { name: "", price: "", duration: "" }]);
  };

  const handleServiceChange = (idx, field, value) => {
    const newServices = [...services];
    newServices[idx][field] = value;
    setServices(newServices);
  };

  const submit = async (e) => {
    e.preventDefault();
    const parsedServices = services.map((s) => ({
      name: s.name,
      price: parseFloat(s.price),
      duration: parseInt(s.duration),
    }));
    const res = await fetch("/api/barbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, services: parsedServices }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      setServices([{ name: "", price: "", duration: "" }]);
      load();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Kuaför / Hizmet Yönetimi</h1>
      <form onSubmit={submit} className="space-y-4 border rounded p-4">
        <div>
          <label className="block mb-1">Kuaför Adı</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Açıklama</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <h3 className="font-medium mb-2">Hizmetler</h3>
          {services.map((srv, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
              <input
                placeholder="Ad"
                className="border rounded px-2 py-1"
                value={srv.name}
                onChange={(e) => handleServiceChange(idx, "name", e.target.value)}
              />
              <input
                placeholder="Fiyat"
                type="number"
                className="border rounded px-2 py-1"
                value={srv.price}
                onChange={(e) => handleServiceChange(idx, "price", e.target.value)}
              />
              <input
                placeholder="Süre (dk)"
                type="number"
                className="border rounded px-2 py-1"
                value={srv.duration}
                onChange={(e) => handleServiceChange(idx, "duration", e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addServiceRow} className="text-sm text-blue-600">
            + Hizmet Ekle
          </button>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kaydet
        </button>
      </form>

      <div className="space-y-4">
        {barbers.map((b) => (
          <div key={b.id} className="border rounded p-4">
            <h2 className="font-semibold">{b.name}</h2>
            <ul className="list-disc ml-5">
              {b.services.map((s) => (
                <li key={s.id}>
                  {s.name} - ₺{s.price} ({s.duration} dk)
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 