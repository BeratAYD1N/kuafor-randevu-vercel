import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const barbers = await prisma.barber.findMany({ include: { services: true } });
  return new Response(JSON.stringify(barbers), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }
  try {
    const body = await req.json();
    const { name, description, services } = body;
    const barber = await prisma.barber.create({
      data: {
        name,
        description,
        services: {
          create: services, // expects array of {name, price, duration}
        },
      },
      include: { services: true },
    });
    return new Response(JSON.stringify(barber), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
} 