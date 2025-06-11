import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Kuaförler | Randevu Sistemi",
};

export default async function BarbersPage() {
  const barbers = await prisma.barber.findMany({ include: { services: true } });

  return (
    <div className="container-padded py-5">
      <h1 className="h3 text-center fw-bold mb-4">Kuaförler</h1>
      <div className="row g-4">
        {barbers.map((barber) => (
          <div key={barber.id} className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h2 className="h5 fw-semibold text-primary mb-2">{barber.name}</h2>
                {barber.description && <p className="text-muted small mb-3">{barber.description}</p>}
                <h6 className="fw-bold">Hizmetler</h6>
                <ul className="list-unstyled small flex-grow-1">
                  {barber.services.map((srv) => (
                    <li key={srv.id} className="d-flex justify-content-between border-bottom py-1">
                      <span>{srv.name} ({srv.duration} dk)</span>
                      <span className="fw-medium">₺{srv.price}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/appointments/new?barber=${barber.id}`} className="btn btn-primary mt-3 w-100">
                  Randevu Al
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 