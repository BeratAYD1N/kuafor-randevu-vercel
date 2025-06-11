import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await isAdmin();
  if (!session) return new Response("Forbidden", { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  return new Response(JSON.stringify(users), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req) {
  const session = await isAdmin();
  if (!session) return new Response("Forbidden", { status: 403 });
  const body = await req.json();
  const { userId, role } = body;

  if (userId === session.user.id) {
    return new Response("Kendi rolünüzü değiştiremezsiniz", { status: 400 });
  }

  const updated = await prisma.user.update({ where: { id: userId }, data: { role } });
  return new Response(JSON.stringify(updated), { headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req) {
  const session = await isAdmin();
  if (!session) return new Response("Forbidden", { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("id gereklidir", { status: 400 });

  await prisma.user.delete({ where: { id } });
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
} 