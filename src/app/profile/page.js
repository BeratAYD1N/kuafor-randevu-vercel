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
    <div className="container-padded py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{maxWidth:'32rem', width:'100%'}}>
        <h1 className="page-title">Profilim</h1>
        <div className="mb-4 text-center">
          <div className="rounded-circle bg-primary bg-opacity-25 d-inline-flex align-items-center justify-content-center" style={{width:64, height:64, fontSize:32, color:'var(--primary)'}}>
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          <div className="mt-2">
            <div className="fw-semibold">{user.name}</div>
            <div className="text-muted small">{user.email}</div>
          </div>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
} 