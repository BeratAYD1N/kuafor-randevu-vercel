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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Randevularım</h1>
      {appointments.length === 0 && <p>Henüz randevunuz yok.</p>}
      {appointments.map((a) => (
        <div key={a.id} className="border rounded p-4 flex flex-col gap-1">
          <span className="font-medium">
            {new Date(a.date).toLocaleString("tr-TR")} - {a.barber.name}
          </span>
          <span>{a.service.name}</span>
          <span className="text-sm text-gray-500 capitalize">{a.status.toLowerCase()}</span>
        </div>
      ))}
    </div>
  );
} 