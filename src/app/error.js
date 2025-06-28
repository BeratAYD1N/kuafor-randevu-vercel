"use client";
export default function Error({ error, reset }) {
  return (
    <div style={{textAlign: "center", marginTop: "4rem"}}>
      <h1>Bir hata oluştu</h1>
      <p>{error?.message || "Bilinmeyen bir hata"}</p>
      <button onClick={() => reset()}>Tekrar Dene</button>
    </div>
  );
} 22