import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  let appointments;
  if (all && session.user.role === "ADMIN") {
    appointments = await prisma.appointment.findMany({
      include: { user: true, barber: true, service: true },
    });
  } else {
    appointments = await prisma.appointment.findMany({
      where: { userId: session.user.id },
      include: { barber: true, service: true },
    });
  }

  return new Response(JSON.stringify(appointments), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { barberId, serviceId, date } = body;

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        barberId,
        serviceId,
        date: new Date(date),
      },
    });

    return new Response(JSON.stringify(appointment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
} 