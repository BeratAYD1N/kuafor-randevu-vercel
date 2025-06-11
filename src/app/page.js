import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const metadata = {
  title: "Kuaför Randevu Sistemi",
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 text-center p-4" style={{background:'#faf5ff'}}>
      {!session ? (
        <div style={{maxWidth:'32rem'}}>
          <h1 className="display-4 fw-bold">Kuaför Randevu Sistemi</h1>
          <p className="text-muted">
            Online olarak kuaförünü seç, hizmetini belirle ve kolayca randevunu oluştur.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link href="/login" className="btn btn-primary">
              Giriş Yap
            </Link>
            <Link href="/register" className="btn btn-outline-primary">
              Kayıt Ol
            </Link>
          </div>
        </div>
      ) : (
        <div style={{maxWidth:'32rem'}}>
          <h1 className="h3 fw-bold">Hoş geldin, {session.user.name}!</h1>
          <p className="text-muted">
            Randevu almak veya mevcut randevularını görüntülemek için devam et.
          </p>
          <Link href="/barbers" className="btn btn-primary mt-3">
            Kuaförleri Gör
          </Link>
        </div>
      )}
    </div>
  );
}
