// components/admin/AdminShell.tsx
import Link from "next/link";

type Props = {
  userEmail?: string | null;
  children: React.ReactNode;
};

const NavItem = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => (
  <Link
    href={href}
    className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition"
  >
    {label}
  </Link>
);

export default function AdminShell({ userEmail, children }: Props) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-900 text-white text-sm font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Admin Panel</p>
              <p className="text-xs text-neutral-500">Manage users & settings</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block rounded-full border px-3 py-1 text-xs text-neutral-600">
              {userEmail ?? "admin"}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border bg-white p-3 md:sticky md:top-[72px] md:h-[calc(100vh-96px)]">
          <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Navigation
          </p>

          <nav className="mt-2 flex flex-col gap-1">
            <NavItem href="/admin" label="Dashboard" />
            <NavItem href="/admin/users" label="Users" />
            {/* เพิ่มเมนูได้ในอนาคต */}
            {/* <NavItem href="/admin/movies" label="Movies" /> */}
            {/* <NavItem href="/admin/settings" label="Settings" /> */}
          </nav>

          <div className="mt-4 rounded-xl bg-neutral-50 p-3">
            <p className="text-sm font-semibold text-neutral-900">Tips</p>
            <p className="mt-1 text-xs text-neutral-600">
              หน้านี้ล็อกเฉพาะ role = <span className="font-medium">admin</span>
            </p>
          </div>
        </aside>

        {/* Content */}
        <main className="rounded-2xl border bg-white p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
