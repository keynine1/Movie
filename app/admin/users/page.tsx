export const dynamic = "force-dynamic";

import AdminUsersTable from "@/components/AdminUsersTable";
import { unstable_noStore as noStore } from "next/cache";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type AdminUser = {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date | null;
};

async function getUsers(): Promise<AdminUser[]> {
  await connectMongoDB();

  const users = await User.find({})
    .select("_id email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return users.map((u: any) => ({
    id: String(u._id),
    email: u.email,
    role: (u.role ?? "user") as "user" | "admin",
    createdAt: u.createdAt ?? null,
  }));
}

export default async function AdminUsersPage() {
  noStore();

  const session = await getServerSession(authOptions);
  const myId = session?.user?.id;

  const users = await getUsers();


  const usersForClient = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
  }));

  return (
    <div>
      <h1>Users</h1>
      <p style={{ opacity: 0.8 }}>Total: {usersForClient.length}</p>

      {usersForClient.length === 0 ? (
        <p>No users</p>
      ) : (
        <AdminUsersTable initialUsers={usersForClient} myId={myId} />
      )}
    </div>
  );
}
