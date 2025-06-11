import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { name } = body;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
} 