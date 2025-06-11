import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import ProfileForm from "./profile-form";

export const metadata = { title: "Profilim" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return <p className="p-6">Giriş yapmalısınız.</p>;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Profilim</h1>
      <ProfileForm user={user} />
    </div>
  );
} 