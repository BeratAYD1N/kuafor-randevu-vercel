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
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Admin Paneli</h1>
      <Link href="/admin/users" className="block border rounded px-4 py-2 hover:bg-gray-100">
        Kullanıcı Yönetimi
      </Link>
      <Link href="/admin/barbers" className="block border rounded px-4 py-2 hover:bg-gray-100">
        Kuaför / Hizmet Yönetimi
      </Link>
    </div>
  );
} 