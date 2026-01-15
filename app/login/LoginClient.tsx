"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();

  const callbackUrl = useMemo(() => search.get("callbackUrl") || "/", [search]);
  const emailFromQuery = useMemo(() => search.get("email") ?? "", [search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // ✅ กัน hydration mismatch / ค่า query มาไม่ทัน
  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setPending(false);
        return;
      }

      router.push(res?.url || callbackUrl);
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
              <h1 className="text-2xl font-semibold text-white">เข้าสู่ระบบ</h1>
              <p className="mt-1 text-sm text-white/60">
                ยินดีต้อนรับกลับมา — เข้าสู่ MoviesApp
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoComplete="current-password"
                  className="h-11 w-full rounded-2xl bg-black/40 px-4 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/25"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending ? "Logging in..." : "Login"}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-white/50">
                  ยังไม่มีบัญชี?
                  <Link href="/register" className="ml-1 text-white hover:underline">
                    Register
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
