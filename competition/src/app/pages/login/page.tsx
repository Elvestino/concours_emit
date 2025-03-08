"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        // Si le token est présent, on stocke le token dans localStorage et redirige
        localStorage.setItem("token", data.token);
        router.push("/admin"); // Redirection vers la page admin
      } else {
        // Si les informations sont incorrectes, on met à jour l'erreur
        setError("Informations incorrectes");
      }
    } catch (err) {
      // Gestion de l'erreur en cas de problème avec la requête
      setError("Une erreur est survenue");
    }
  };

  // Affiche une alerte si une erreur est présente
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error,
      });
      // Réinitialiser l'erreur après l'affichage de l'alerte
      setError("");
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white border p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6"> Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
