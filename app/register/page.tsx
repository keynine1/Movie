"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [name, setName] = useState(search.get("name") ?? "");
  const [email, setEmail] = useState(search.get("email") ?? "");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);
    setPending(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Register failed");
        setPending(false);
        return;
      }

      setOk(true);
      // ส่ง email ไปให้หน้า login เติมให้เลย
      router.push(`/login?email=${encodeURIComponent(email)}`);
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setPending(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black" />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-14 sm:px-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl bg-white/7 p-6 ring-1 ring-white/12 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-white">สมัครสมาชิก</h1>
              <p className="mt-1 text-sm text-white/60">
                สร้างบัญชีเพื่อบันทึกรายการโปรดของคุณ
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            {ok ? (
              <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                สมัครสมาชิกสำเร็จ! กำลังพาไปหน้า Login…
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/70">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 w-full rounded-2xl bg-black/40 px-4 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/70">Email</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-2xl bg-black/40 px-4 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/70">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-2xl bg-black/40 px-4 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/25"
                />
                <p className="text-[11px] text-white/40">
                  Tip: ใช้อย่างน้อย 4 ตัวอักษร
                </p>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending ? "Creating account..." : "Register"}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-white/50">
                  มีบัญชีอยู่แล้ว?
                  <Link href="/login" className="ml-1 text-white hover:underline">
                    Login
                  </Link>
                </span>

                <Link href="/" className="text-white/60 hover:text-white">
                  Back to Home
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-white/35">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
