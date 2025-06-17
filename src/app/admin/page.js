import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const metadata = { title: "Admin Paneli" };

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return <p className="p-6">Erişim yok</p>;
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 admin-bg">
      <div className="admin-card mx-auto">
        <h1 className="page-title">Admin Paneli</h1>
        <Link href="/admin/users" className="admin-btn">
          Kullanıcı Yönetimi
        </Link>
        <Link href="/admin/barbers" className="admin-btn">
          Kuaför / Hizmet Yönetimi
        </Link>
      </div>
    </div>
  );
} 