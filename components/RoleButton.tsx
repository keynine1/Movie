"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RoleButton({
  userId,
  currentRole,
  isSelf,
  onUpdated,
}: {
  userId: string;
  currentRole: "user" | "admin";
  isSelf: boolean;
  onUpdated: (newRole: "user" | "admin") => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const nextRole: "user" | "admin" = currentRole === "admin" ? "user" : "admin";
  const label = currentRole === "admin" ? "Demote to user" : "Promote to admin";

  async function onClick() {
    setError("");

    if (isSelf) {
      setError("You cannot change your own role.");
      return;
    }

    const ok = confirm(`Change role to "${nextRole}" ?`);
    if (!ok) return;

    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });

    const data = await res.json().catch(() => null);


    if (!res.ok) {
      setError(data?.message || "Failed to update role");
      return;
    }

    // ✅ อัปเดต UI ทันที (ไม่ต้องรอ refresh)
    onUpdated(nextRole);

    // ✅ ซิงก์กับ server อีกที
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <button
        onClick={onClick}
        disabled={isPending || isSelf}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
          cursor: isPending || isSelf ? "not-allowed" : "pointer",
          opacity: isPending || isSelf ? 0.6 : 1,
        }}
      >
        {isPending ? "Updating..." : label}
      </button>

      {error ? <small style={{ color: "crimson" }}>{error}</small> : null}
      {isSelf ? <small style={{ opacity: 0.7 }}>This is you</small> : null}
    </div>
  );
}
