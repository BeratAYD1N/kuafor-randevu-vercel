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
    <div className="admin-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="admin-card mx-auto p-0" style={{maxWidth:'900px', width:'100%', padding:'2.5rem'}}>
        <h1 className="page-title">Kuaför / Hizmet Yönetimi</h1>
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <form onSubmit={submit} className="admin-form mb-4">
              <div className="mb-3">
                <label className="form-label">Kuaför Adı</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Açıklama</label>
                <input
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <h3 className="fw-semibold mb-2">Hizmetler</h3>
                {services.map((srv, idx) => (
                  <div key={idx} className="row g-2 mb-2">
                    <div className="col">
                      <input
                        placeholder="Ad"
                        className="form-control"
                        value={srv.name}
                        onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        placeholder="Fiyat"
                        type="number"
                        className="form-control"
                        value={srv.price}
                        onChange={(e) => handleServiceChange(idx, 'price', e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        placeholder="Süre (dk)"
                        type="number"
                        className="form-control"
                        value={srv.duration}
                        onChange={(e) => handleServiceChange(idx, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addServiceRow} className="btn btn-outline-purple btn-sm mt-1">
                  + Hizmet Ekle
                </button>
              </div>
              <button type="submit" className="btn btn-purple w-100">Kaydet</button>
            </form>
          </div>
          <div className="col-12 col-lg-7 d-flex flex-column gap-3">
            {barbers.map((b) => (
              <div key={b.id} className="admin-user-card">
                <h2 className="fw-semibold mb-2" style={{color:'#7c3aed'}}>{b.name}</h2>
                <ul className="list-unstyled ms-3 mb-0">
                  {b.services.map((s) => (
                    <li key={s.id} className="mb-1">
                      <span className="fw-medium">{s.name}</span> - ₺{s.price} <span className="text-muted">({s.duration} dk)</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 