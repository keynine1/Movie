"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        color: "rgba(255,255,255,0.78)",
        textDecoration: "none",
        fontSize: 14,
        padding: "8px 10px",
        borderRadius: 10,
        transition: "background 150ms ease, color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.color = "rgba(255,255,255,0.92)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,255,255,0.78)";
      }}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background:
          "linear-gradient(to bottom, rgba(10,10,10,0.9), rgba(10,10,10,0.65))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            {/* Logo dot */}
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.22)",
                boxShadow: "0 0 0 4px rgba(255,255,255,0.06)",
              }}
            />
            <span
              style={{
                fontWeight: 800,
                letterSpacing: 0.2,
                color: "rgba(255,255,255,0.92)",
                fontSize: 15,
              }}
            >
              Movies
            </span>
          </Link>

          <div
            style={{
              height: 18,
              width: 1,
              background: "rgba(255,255,255,0.10)",
              margin: "0 2px",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/movies">Movies</NavLink>
            {session?.user && <NavLink href="/favorites">Favorites</NavLink>}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {status === "loading" ? (
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
              Loading...
            </span>
          ) : session?.user ? (
            <>
              <span
                title={session.user.email ?? ""}
                style={{
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.60)",
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {session.user.email}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  cursor: "pointer",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.92)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 120ms ease, background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/register"
                style={{
                  textDecoration: "none",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(10,10,10,0.95)",
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
