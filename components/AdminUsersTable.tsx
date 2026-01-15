"use client";

import { useState } from "react";
import RoleButton from "@/components/RoleButton";

type AdminUser = {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string | null;
};

export default function AdminUsersTable({
  initialUsers,
  myId,
}: {
  initialUsers: AdminUser[];
  myId?: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  function updateRole(userId: string, newRole: "user" | "admin") {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>
            Email
          </th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>
            Role
          </th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>
            Created
          </th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.email}</td>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.role}</td>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
              {u.createdAt ? new Date(u.createdAt).toLocaleString("th-TH") : "-"}
            </td>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
              <RoleButton
                userId={u.id}
                currentRole={u.role}
                isSelf={myId === u.id}
                onUpdated={(newRole) => updateRole(u.id, newRole)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
