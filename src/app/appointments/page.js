import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export const metadata = { title: "Randevularım" };

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="p-6">Giriş yapmanız gerekmektedir.</p>;
  }

  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: { barber: true, service: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="container-padded py-5" style={{maxWidth:'40rem'}}>
      <h1 className="page-title">Randevularım</h1>
      {appointments.length === 0 && <p className="text-center text-muted">Henüz randevunuz yok.</p>}
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
              </div>
              <span className={`badge px-3 py-2 ${a.status === 'PENDING' ? 'bg-warning text-dark' : a.status === 'CANCELLED' ? 'bg-danger' : 'bg-success'}`}
                style={{fontSize:'0.95rem', letterSpacing:'0.5px', minWidth:'90px', textAlign:'center'}}>
                {a.status === 'PENDING' ? 'Bekliyor' : a.status === 'CANCELLED' ? 'İptal' : 'Onaylandı'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 