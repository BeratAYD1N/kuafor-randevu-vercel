import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    where: { id: { not: session.user.id } },
  });
  return new Response(JSON.stringify(users), {
    headers: { "Content-Type": "application/json" },
  });
} 