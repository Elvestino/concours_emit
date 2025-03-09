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
        console.error("Erreur lors de la récupération des participants :", error);
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
        title: "Participant accepté",
        text: `Vous avez accepté ce participant avec le numéro ${upload.id}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de l'acceptation du participant.",
      });
      console.error("Erreur :", error);
    }
  };

  // Rejeter un participant
  const handleDelete = async (upload: Upload) => {
    const confirmation = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous vraiment rejeter le participant ${upload.id} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Rejeter",
      cancelButtonText: "Annuler",
    });

    if (confirmation.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `${API_URL}/participant/${upload.id}/reject`,
          
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
          title: "Participant rejeté",
          text: `Le participant ${upload.id} a été rejeté.`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur s'est produite lors du rejet du participant.",
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
        title: "Réinitialisation réussie",
        text: "Les statuts des candidats ont été réinitialisés.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de la réinitialisation.",
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
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex flex-col w-full mt-4 animate-fade-in">
      <h1 className="text-3xl font-bold flex justify-center text-center mb-4 text-black">
        Liste des Participants
      </h1>
      <div className="flex sm:flex-row justify-between items-center mx-4 my-4">
        {/* Filtre */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-black text-center"
        >
          <option value="all">Tous</option>
          <option value="Accepter">Accepter</option>
          <option value="Non traiter">Non traiter</option>
          <option value="En traitement">En traitement</option>
          <option value="Non accepter">Non accepter</option>
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
            Page {currentPage} / {totalPage}
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
          Actualiser
        </button>
      </div>

      {/* Tableau des Participants */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-500 shadow-4xl rounded-lg overflow-hidden">
          <thead className="bg-blue-400 text-white">
            <tr>
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
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                key={upload.id}
              >
                <td className="p-3 border-b">{upload.id}</td>
                <td className="p-3 border-b text-blue-500">
                  <a
                    href={`http://localhost:5000/${upload.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger PDF
                  </a>
                </td>
                <td className="p-3 border-b">
                  <div className="flex justify-center">
                    <audio controls key={upload.instru_mp3}>
                      <source
                        src={`http://localhost:5000/${upload.instru_mp3}`}
                        type="audio/mp3"
                      />
                      Votre navigateur ne supporte pas un élément audio.
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
                      Votre navigateur ne supporte pas un élément audio.
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
                      Votre navigateur ne supporte pas un élément audio.
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
                      ? "Accepter"
                      : upload.status === "rejeter"
                      ? "Rejeter"
                      : upload.status === "en traitement"
                      ? "En traitement"
                      : "Non traiter"}
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
                      disabled={upload.status === "accepter" || upload.status === "rejeter"}
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => handleDelete(upload)}
                      className={`p-2 rounded mb-2 ${
                        upload.status === "rejeter"
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-red-500 text-white"
                      }`}
                      disabled={upload.status === "rejeter" || upload.status === "accepter"}
                    
                    >
                      Rejeter
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