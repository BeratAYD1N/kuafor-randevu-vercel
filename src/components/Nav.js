"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold" style={{color:'var(--primary)'}}>
          Elit Erkek Kuaförü
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <Link href="/barbers" className="nav-link">
                Kuaförler
              </Link>
            </li>
            {session && (
              <>
                <li className="nav-item">
                  <Link href="/appointments" className="nav-link">Randevularım</Link>
                </li>
                <li className="nav-item">
                  <Link href="/messages" className="nav-link">Mesajlar</Link>
                </li>
                <li className="nav-item">
                  <Link href="/profile" className="nav-link">Profil</Link>
                </li>
                {session.user.role === "ADMIN" && (
                  <li className="nav-item">
                    <Link href="/admin" className="nav-link">Admin</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="d-flex gap-2">
            {!session ? (
              <>
                <Link href="/login" className="btn btn-outline-purple">Giriş</Link>
                <Link href="/register" className="btn btn-purple">Kayıt Ol</Link>
              </>
            ) : (
              <button className="btn btn-outline-danger btn-sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Çıkış
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 