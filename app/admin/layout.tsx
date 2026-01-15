import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <a href="/admin">Dashboard</a>
        <a href="/admin/users">Users</a>
      </div>
      {children}
    </div>
  );
}
