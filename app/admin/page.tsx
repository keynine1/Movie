// app/admin/page.tsx
import Link from "next/link";

const StatCard = ({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) => (
  <div className="rounded-2xl border bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
      {title}
    </p>
    <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    {hint ? <p className="mt-1 text-sm text-neutral-600">{hint}</p> : null}
  </div>
);

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-600">
            ภาพรวมระบบ และทางลัดสำหรับจัดการข้อมูล
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/users"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Manage Users
          </Link>
          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition"
          >
            Back to site
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Users" value="—" hint="ต่อ API ดึงจำนวนผู้ใช้ได้" />
        <StatCard title="Favorites" value="—" hint="สรุปยอด favorites ทั้งหมด" />
        <StatCard title="Deploy" value="Vercel" hint="Production environment" />
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border bg-neutral-50 p-4">
        <p className="text-sm font-semibold text-neutral-900">Quick actions</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href="/admin/users"
            className="rounded-xl border bg-white px-4 py-3 text-sm text-neutral-800 hover:bg-neutral-50 transition"
          >
            ดู/แก้ไขผู้ใช้ และตั้ง role
          </Link>
          <Link
            href="/movies"
            className="rounded-xl border bg-white px-4 py-3 text-sm text-neutral-800 hover:bg-neutral-50 transition"
          >
            ไปหน้า Movies (ตรวจ UI ฝั่งผู้ใช้)
          </Link>
        </div>
      </div>
    </div>
  );
}
