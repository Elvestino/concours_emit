"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/pages/login");
      return;
    }

    axios
      .post("/api/verify-token", { token })
      .then((response) => {
        if (response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          router.push("/pages/login");
        }
      })
      .catch(() => {
        router.push("/pages/login");
      });
  }, [router]);

  if (!isAdmin) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Page Admin</h1>
      <p>Bienvenue sur la page admin.</p>
    </div>
  );
}
