"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "@/app/environment/api";
import BarList from "./components/BarLIst";
import Header from "./components/Header";
import Footer from "./components/footer";

export default function Home() {
  const [pdfPath, setPdf] = useState<File | null>(null);
  const [mp3Path, setMp3] = useState<File | null>(null);
  const [file, setFile] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!pdfPath || !mp3Path) {
      Swal.fire("Erreur", "Veuillez ajouter un PDF et un MP3", "error");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfPath);
    formData.append("mp3", mp3Path);

    console.log("FormData envoyé :", [...formData.entries()]);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const participantID = response.data.participantID;
      Swal.fire({
        icon: "success",
        title: `Identifiant : ${participantID}`,
        html: ` <strong> &#9888;  Veuiller ne pas perdre votre identifiant </strong>`,
      }).then(() => {
        window.location.reload();
      });

      setPdf(null);
      setMp3(null);
    } catch (error) {
      console.log(error);
      Swal.fire("Erreur", "Échec de l'upload", "error");
    }
  };
  const handleFileMp3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setMp3(file || null);
  };

  const handleFilePdf = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPdf(file || null);
  };

  return (
    <main>
      <Header />
      <div className="md:grid md:grid-cols-2 justify-center items-center gap-10 animate-fade-in ">
        <div className="flex items-center justify-center mx-14 m-8 lg:mx-20 md:mx-3">
          <BarList />
        </div>
        <div className="flex flex-col border rounded-xl text-center p-9 mx-20 mb-10 mt-10 lg:mx-40 md:mx-10 ">
          <h1 className="lg:text-2xl text-xl font-bold mb-4 text-black">
            Ajout de fichiers
          </h1>
          <label htmlFor="pdf" className="m-4 text-left  text-black">
            Fichier PDF :
          </label>
          <div className="w-full">
            <label
              htmlFor="pdf"
              className="block w-full cursor-pointer rounded-md border-gray-400 border bg-transparent py-2 text-center text-blue-500 hover:bg-gray-400 hover:text-white transition"
            >
              Selectionner un fichier
            </label>
            <input
              id="pdf"
              accept=".pdf"
              type="file"
              onChange={handleFilePdf}
              className="hidden"
            />
            <p className="mt-2 text-gray-600">
              {pdfPath ? pdfPath.name : "aucune fichier selectionner"}
            </p>
          </div>
          <label htmlFor="mp3" className="m-4 text-left  text-black">
            Fichier MP3 :
          </label>
          <div className="w-full mb-4">
            <label
              htmlFor="mp3"
              className="block w-full cursor-pointer rounded-md border-gray-400 border bg-transparent py-2 text-center text-blue-500 hover:bg-gray-400 hover:text-white transition"
            >
              Selectionner un fichier
            </label>
            <input
              id="mp3"
              accept=".mp3"
              type="file"
              onChange={handleFileMp3}
              className="hidden"
            />
            <p className="mt-2 text-gray-600">
              {mp3Path ? mp3Path.name : "aucune fichier selectionner"}
            </p>
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
