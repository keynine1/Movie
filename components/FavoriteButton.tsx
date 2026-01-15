"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  movieId,
  title,
  posterPath,
}: {
  movieId: number;
  title: string;
  posterPath?: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [favorited, setFavorited] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ โหลดสถานะเริ่มต้นว่าถูก favorite ไว้หรือยัง
  useEffect(() => {
    const run = async () => {
      // ถ้ายังโหลด session อยู่ ให้รอก่อน
      if (status === "loading") return;

      // ไม่ login → ไม่ favorited
      if (!session) {
        setFavorited(false);
        setChecking(false);
        return;
      }

      setChecking(true);
      try {
        const res = await fetch(`/api/favorites/status?movieId=${movieId}`);
        const data = await res.json();
        setFavorited(!!data.favorited);
      } catch {
        setFavorited(false);
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [movieId, session, status]);

  // ✅ กดแล้ว toggle
  const toggle = async () => {
    if (!session) return router.push("/login");

    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, title, posterPath }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Toggle favorite failed");
        return;
      }

      setFavorited(!!data.favorited);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <button disabled style={{ padding: "8px 12px" }}>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #ddd",
        cursor: loading ? "not-allowed" : "pointer",
        background: favorited ? "#ffe6e6" : "white",
      }}
    >
      {favorited ? "❤️ Favorited" : "🤍 Add Favorite"}
    </button>
  );
}
