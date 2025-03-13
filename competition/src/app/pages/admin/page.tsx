"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_URL } from "@/app/environment/api";
import Swal from "sweetalert2";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

interface Upload {
  id: number;
  pdf: string;
  instru_mp3: string;
  akapela_mp3: string;
  final_mp3: string;
  status: "non traiter" | "en traitement" | "accepter" | "rejeter";
}

export default function AdminPage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<Upload[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(true);
  const router = useRouter();
  const itemsPerPage = 7;

  // Connexion Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("participantAccepted", (updatedParticipant) => {
      setUploads((prevUploads) =>
        prevUploads.map((u) =>
          u.id === updatedParticipant.id
            ? { ...u, status: updatedParticipant.status }
            : u
        )
      );
    });

    socket.on("participantRejected", (updatedParticipant) => {
      setUploads((prevUploads) =>
        prevUploads.map((u) =>
          u.id === updatedParticipant.id
            ? { ...u, status: updatedParticipant.status }
            : u
        )
      );
    });

    socket.on("participantInProgress", (updatedParticipant) => {
      setUploads((prevUploads) =>
        prevUploads.map((u) =>
          u.id === updatedParticipant.id
            ? { ...u, status: updatedParticipant.status }
            : u
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/pages/login");
    } else {
      setIsAdmin(false);
    }
  }, [router]);

  // Récupérer les participants
  useEffect(() => {
    const fetchUploads = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/admin/listes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des participants :",
          error
        );
      }
    };

    fetchUploads();
  }, []);

  // Filtrer les participants
  useEffect(() => {
    let filtered = uploads;

    if (statusFilter !== "all") {
      filtered = uploads.filter((upload) =>
        statusFilter === "Accepter"
          ? upload.status === "accepter"
          : statusFilter === "Non accepter"
          ? upload.status === "rejeter"
          : statusFilter === "En traitement"
          ? upload.status === "en traitement"
          : upload.status === "non traiter"
      );
    }

    setFilteredUploads(filtered);
    setCurrentPage(1);
  }, [statusFilter, uploads]);

  // Accepter un participant
  const handleAccept = async (upload: Upload) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/participant/${upload.id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUploads((prevUploads) =>
        prevUploads.map((u) =>
          u.id === upload.id ? { ...u, status: "accepter" } : u
        )
      );

      Swal.fire({
        icon: "success",
        title: "Mpandray anjara nekena",
        text: `Nekenao ity mpandray anjara ity miaraka amin'ny laharana ${upload.id}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hadisoana",
        text: "Nisy hadisoana tamin'ny fankatoavana ny mpandray anjara.",
      });
      console.error("Erreur :", error);
    }
  };

  // participant en traitement
  const handleMarkAsInProgress = async (upload: Upload) => {
    try {
      const token = localStorage.getItem("token");

      // Envoyer la requête PATCH au backend
      await axios.patch(
        `${API_URL}/participant/${upload.id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mettre à jour l'état local
      setUploads((prevUploads) =>
        prevUploads.map((u) =>
          u.id === upload.id ? { ...u, status: "en traitement" } : u
        )
      );
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  // Rejeter un participant
  const handleDelete = async (upload: Upload) => {
    const confirmation = await Swal.fire({
      title: "Azonao antoka ve ?",
      text: `Tena te-handava ny mpandray anjara ${upload.id} ve ianao ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Lavina",
      cancelButtonText: "Hanafoana",
    });

    if (confirmation.isConfirmed) {
      try {
        const token = localStorage.getItem("token");

        console.log("token rejeter", token);
        await axios.patch(
          `${API_URL}/participant/${upload.id}/reject`,
          {},

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUploads((prevUploads) =>
          prevUploads.map((u) =>
            u.id === upload.id ? { ...u, status: "rejeter" } : u
          )
        );

        Swal.fire({
          icon: "success",
          title: "Mpandray anjara nolavina",
          text: `Nolavina ny mpandray anjara ${upload.id}.`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Hadisoana",
          text: "Nisy hadisoana tamin'ny fandavana ny mpandray anjara.",
        });
        console.error("Erreur:", error);
      }
    }
  };

  // Réinitialiser les participants
  const handleReset = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/participant/actualise`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(`${API_URL}/admin/listes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploads(response.data);

      Swal.fire({
        icon: "success",
        title: "Fanavaozana nahomby",
        text: "Voavao ny toetoetran'ny kandida.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hadisoana",
        text: "Nisy hadisoana tamin'ny fanavaozana.",
      });
      console.error("Erreur :", error);
    }
  };

  // Pagination
  const totalPage = Math.ceil(filteredUploads.length / itemsPerPage);
  const paginatedUploads = filteredUploads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isAdmin) {
    return <p>Mampiditra...</p>;
  }

  return (
    <div className="flex flex-col w-full mt-4 animate-fade-in">
      <h1 className="text-3xl font-bold flex justify-center text-center mb-4 text-white">
        Lisitra ireo Mpandray anjara
      </h1>
      <div className="flex sm:flex-row justify-between items-center mx-4 my-4">
        {/* Filtre */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-black text-center cursor-pointer"
        >
          <option value="all">Rehetra</option>
          <option value="Accepter">Nekena</option>
          <option value="Non traiter">Tsy voahodina</option>
          <option value="En traitement">Eo am-pikarakarana</option>
          <option value="Non accepter">Tsy Nekena</option>
        </select>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2 text-black">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <span className="py-2">
            Pejy {currentPage} / {totalPage}
          </span>
          <button
            disabled={currentPage === totalPage}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Bouton Actualiser */}
        <button
          type="button"
          className="bg-blue-500 py-2 px-4 rounded m-2 hover:bg-blue-400 text-white"
          onClick={handleReset}
        >
          Havaozina
        </button>
      </div>

      {/* Tableau des Participants */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-500 shadow-4xl rounded-lg overflow-hidden">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="border-b text-center p-1"></th>
              <th className="border-b text-center p-1">Laharana</th>
              <th className="border-b text-center p-1">Rakitra PDF</th>
              <th className="border-b text-center p-3">Rakitra feon-kira</th>
              <th className="border-b text-center p-3">Rakitra feo</th>
              <th className="border-b text-center p-3">Rakitra hira</th>
              <th className="border-b text-center p-1">Toetoetra</th>
              <th className="border-b text-center p-1">Hetsika</th>
            </tr>
          </thead>
          <tbody className="text-center text-black">
            {paginatedUploads.map((upload, index) => (
              <tr
                className={index % 2 === 0 ? "bg-white" : "bg-gray-300"}
                key={upload.id}
              >
                <td className="p-3 border-b">
                  {upload.status === "non traiter" && (
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleMarkAsInProgress(upload)}
                      className="form-checkbox h-5 w-5  flex items-center justify-center text-blue-600"
                    />
                  )}
                </td>
                <td className="p-3 border-b">{upload.id}</td>
                <td className="p-3 border-b text-blue-500">
                  <a
                    href={`http://localhost:5000/${upload.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sintomy PDF
                  </a>
                </td>
                <td className="p-3 border-b">
                  <div className="flex justify-center">
                    <audio controls key={upload.instru_mp3}>
                      <source
                        src={`http://localhost:5000/${upload.instru_mp3}`}
                        type="audio/mp3"
                      />
                      Tsy manohana singa audio ny navigateur-nao.
                    </audio>
                  </div>
                </td>
                <td className="p-3 border-b">
                  <div className="flex justify-center">
                    <audio controls key={upload.akapela_mp3}>
                      <source
                        src={`http://localhost:5000/${upload.akapela_mp3}`}
                        type="audio/mp3"
                      />
                      Tsy manohana singa audio ny navigateur-nao.
                    </audio>
                  </div>
                </td>
                <td className="p-3 border-b">
                  <div className="flex justify-center">
                    <audio controls key={upload.final_mp3}>
                      <source
                        src={`http://localhost:5000/${upload.final_mp3}`}
                        type="audio/mp3"
                      />
                      Tsy manohana singa audio ny navigateur-nao.
                    </audio>
                  </div>
                </td>
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 text-sm font-semibold rounded ${
                      upload.status === "accepter"
                        ? "bg-green-200 text-green-700"
                        : upload.status === "rejeter"
                        ? "bg-red-200 text-red-700"
                        : upload.status === "en traitement"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-yellow-200 text-yellow-700"
                    }`}
                  >
                    {upload.status === "accepter"
                      ? "Nekena"
                      : upload.status === "rejeter"
                      ? "Lavina"
                      : upload.status === "en traitement"
                      ? "Eo am-pikarakarana"
                      : "Tsy voahodina"}
                  </span>
                </td>
                <td className="p-3 border-b flex gap-2 justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(upload)}
                      className={`p-2 rounded mb-2 ${
                        upload.status === "accepter"
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-blue-500 text-white"
                      }`}
                      disabled={
                        upload.status === "accepter" ||
                        upload.status === "rejeter"
                      }
                    >
                      Ekena
                    </button>
                    <button
                      onClick={() => handleDelete(upload)}
                      className={`p-2 rounded mb-2 ${
                        upload.status === "rejeter"
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-red-500 text-white"
                      }`}
                      disabled={
                        upload.status === "rejeter" ||
                        upload.status === "accepter"
                      }
                    >
                      Lavina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
