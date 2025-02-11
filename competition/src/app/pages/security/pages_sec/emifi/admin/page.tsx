"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/app/environment/api";
import Swal from "sweetalert2";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";


interface Upload {
  id: number;
  pdf: string;
  mp3: string;
  accepted: boolean;
}

export default function AdminPage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<Upload[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchUploads = async () => {
      const response = await axios.get(`${API_URL}/admin/listes`);
      const fixedData = response.data.map((upload: Upload) => ({
        ...upload,
        accepted: Boolean(upload.accepted)
      }));
      setUploads(fixedData);
      console.log("useEffect",response.data)
      
    };
     
    fetchUploads();
  }, []);

  useEffect(() => {
    let filtered = uploads;
    if (statusFilter !== "all") {
      filtered = uploads.filter((upload) => 
        statusFilter === "Accepter" ? upload.accepted : !upload.accepted
      );
    }

    setFilteredUploads(filtered);
    setCurrentPage(1);
  },[statusFilter, uploads]);

  const handleAccept = async (upload: Upload) => {
    try {
      await axios.patch(`${API_URL}/participant/${upload.id}/accept`, {
        accepted: true,
      });

      // const updatedUploads = uploads.map((u)=> u.id === upload.id ? { ...u, accepted: true} : u);
      // setUploads(updatedUploads);

      setUploads((prevUploads) => 
      prevUploads.map((u) => u.id === upload.id ? {...u, accepted: true} : u));
      console.log("accepte", setUploads)
    } catch(error) {

    }
    

    Swal.fire({
      icon: "success",
      title: "Participant accepté",
      text: `Vous avez accepté ce participant avec le numéro ${upload.id}`,
    });
  };

  const handleDelete = async (upload: Upload) => {
    const confirmation = await Swal.fire({
      title: "Etes-vous sur?",
      text: `Voulez-vous vraiment rejeter le participant ${upload.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Rejeter",
      cancelButtonText: "Annuler"
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/participant/${upload.id}`);

        const response = await axios.get(`${API_URL}/admin/listes`);
        setUploads((prev) => prev.filter((u) => u.id !== upload.id));

        Swal.fire({
          icon: "success",
          title: "participant rejeter",
          text: `le participant ${upload.id} a ete rejeter`
        })
      }catch(error){
        Swal.fire({
          icon: "error",
          title: "error",
          text: `Une erreur se produit pendant le rejet`
        });
       console.error("erreur", error)
      }
    }
  }

    const handleReset = async () => {
      try {
        await axios.put(`${API_URL}/participant/actualise`);

        const response = await axios.get(`${API_URL}/admin/listes`);
        console.log(response.data)
        setUploads(response.data);

        Swal.fire({
          icon: "success",
          title: "Actualsation reussie",
          text: "les status des candidats sont reinitialiser"
        })

      } catch(error) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est produit lors de la reinitialisation"
        });
        console.error("erreur lors de la reinitialisation : ", error)
      }
    };  

    const totalPage = Math.ceil(filteredUploads.length / itemsPerPage);
    const paginatedUploads = filteredUploads.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
  return (

    <div className="flex flex-col w-full mt-4 animate-fade-in">
    <h1 className="text-3xl font-bold flex justify-center text-center mb-4 text-black">Listes des Participants</h1>
      <div className="flex sm:flex-row justify-between items-center mx-4 my-4">
        {/* filtre */}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-3 py-2 text-black text-center">
          <option value="all">Tous</option>
          <option value="Accepter">Accepter</option>
          <option value="Non traiter">Non traiter</option>
        </select>

        {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2 text-black">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} 
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" >
                       <ChevronLeftIcon className="w-6 h-6 text-gray-700"/>
                      </button> 
                    <span className="py-2">
                      Page {currentPage} / {totalPage}
                    </span> 
                <button disabled={currentPage === totalPage} onClick={() => setCurrentPage((prev) => prev + 1)} 
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" > 
                    <ChevronRightIcon className="w-6 h-6 text-gray-700"/> 
                </button> 
            </div>


        <button type="button" className="bg-blue-500 py-2 px-4 rounded m-2 hover:bg-blue-400 text-white" onClick={handleReset}>
          Actualiser
        </button>
        
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-500 shadow-4xl rounded-lg overflow-hidden">
          <thead className="bg-blue-400 text-white ">
            <tr>
              <th className="border-b text-center p-1">Numero</th>
              <th className="border-b text-center p-1">PDF</th>
              <th className="border-b text-center p-3">MP3</th>
              <th className="border-b text-center p-1">Status</th>
              <th className="border-b text-center p-1">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center text-black">
            
            {paginatedUploads.map((upload, index) => (
              <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"} key={upload.id}>
                                  {/* id */}
                <td className="p-3 border-b">{upload.id}</td>
                                  {/* Lien de téléchargement pour le fichier PDF */}
                <td className="p-3 border-b text-blue-500">
                  <a href={`${"http://localhost:5000"}/${upload.pdf}`} target="_blank" rel="noopener noreferrer">
                    Télécharger PDF
                  </a>
                </td>
                                  {/* Lien de téléchargement pour le fichier MP3 */}
                <td className="p-3 border-b">
                    <div className="flex justify-center">
                        <audio controls key={upload.mp3}>
                          <source src={`${`http://localhost:5000/${upload.mp3}`}`} type="audio/mp3"/>
                          {upload.mp3}
                        </audio> 
                    </div>               
                </td>
                                  {/* status */}
                <td className="p-3 border-b">
                    <span className={`px-2 py-1 text-sm font-semibold rounded ${upload.accepted ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                      {upload.accepted === true ? "Accepter" : "Non traiter"}
                    </span>
                </td>
                                  {/* boutton accepter et refuser */}
                <td className="p-3 border-b flex gap-2 justify-center">
                  
                  <>
                  <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(upload)}
                          className={`p-2 rounded mb-2 ${upload.accepted ? "bg-gray-500 text-white cursor-not-allowed" : "bg-blue-500 text-white"}`}
                          disabled={upload.accepted === true}
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => handleDelete(upload)}
                          className={`p-2 rounded mb-2 ${upload.accepted ? "bg-gray-500 text-white cursor-not-allowed" : "bg-red-500 text-white"}`}
                          disabled={upload.accepted === true}
                        >
                          Rejeter
                        </button>
                  </div>
                  </>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}
