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
  const [instru_mp3, setMp3Instru] = useState<File | null>(null);
  const [akapela_mp3, setMp3Music] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!pdfPath || !mp3Path || !akapela_mp3 || !instru_mp3) {
      Swal.fire("Hadisoana", "Azafady, ampio rakitra PDF sy MP3", "error");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfPath);
    formData.append("mp3", mp3Path);
    formData.append("mp3", instru_mp3);
    formData.append("mp3", akapela_mp3);

    console.log("FormData lasa :", [...formData.entries()]);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const participantID = response.data.participantID;
      Swal.fire({
        icon: "success",
        title: `Laharana : ${participantID}`,
        html: ` <strong> &#9888; Azafady, tandremo very ny laharana anao </strong>`,
      }).then(() => {
        window.location.reload();
      });

      setPdf(null);
      setMp3(null);
    } catch (error) {
      console.log(error);
      Swal.fire("Hadisoana", "Tsy nahomby ny fametrahana rakitra", "error");
    }
  };
  const handleFileMp3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setMp3(file || null);
  };
  const handleFileMp3Instru = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setMp3Instru(file || null);
  };
  const handleFileMp3Music = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setMp3Music(file || null);
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
        <div className="flex flex-col bg-white shadow-lg rounded-xl text-center p-9 mx-20 mt-5 lg:mx-40 md:mx-10 ">
          <h1 className="lg:text-2xl text-xl font-bold mb-2 text-black">
            Fampidirana rakitra
          </h1>
          <label htmlFor="pdf" className="mb-1 text-left  text-black">
            Rakitra PDF :
          </label>
          <div className="w-full">
            <label
              htmlFor="pdf"
              className="block w-full cursor-pointer rounded-md border-gray-400 border bg-transparent py-2 text-center text-blue-500 hover:bg-gray-400 hover:text-white transition"
            >
              Mifidiana rakitra
            </label>
            <input
              id="pdf"
              accept=".pdf"
              type="file"
              onChange={handleFilePdf}
              className="hidden"
            />
            <p className="mt-2 text-gray-600">
              {pdfPath ? pdfPath.name : "Tsy misy rakitra voafantina"}
            </p>
          </div>
          <label htmlFor="mp3" className="mb-1 text-left  text-black">
            Rakitra feon-kira :
          </label>
          <div className="w-full mb-2">
            <label
              htmlFor="mp3"
              className="block w-full cursor-pointer rounded-md border-gray-400 border bg-transparent py-2 text-center text-blue-500 hover:bg-gray-400 hover:text-white transition"
            >
              Mifidiana rakitra
            </label>
            <input
              id="mp3"
              accept=".mp3"
              type="file"
              onChange={handleFileMp3Instru}
              className="hidden"
            />
            <p className="mt-2 text-gray-600">
              {instru_mp3 ? instru_mp3.name : "Tsy misy rakitra voafantina"}
            </p>
          </div>
          <label htmlFor="mp3" className="mb-1 text-left  text-black">
            Rakitra feo tsisy feonkira :
          </label>
          <div className="w-full mb-2">
            <label
              htmlFor="mp3"
              className="block w-full cursor-pointer rounded-md border-gray-400 border bg-transparent py-2 text-center text-blue-500 hover:bg-gray-400 hover:text-white transition"
            >
              Mifidiana rakitra
            </label>
            <input
              id="mp3"
              accept=".mp3"
              type="file"
              onChange={handleFileMp3Music}
              className="hidden"
            />
            <p className="mt-2 text-gray-600">
              {akapela_mp3 ? akapela_mp3.name : "Tsy misy rakitra voafantina"}
            </p>
          </div>
          <label htmlFor="mp3" className="mb-1 text-left  text-black">
            Rakitra hira :
          </label>
          <div className="w-full mb-2">
            <label
              htmlFor="mp3"
              className="block w-full cursor-pointer rounded-md border-gray-400 border bg-transparent py-2 text-center text-blue-500 hover:bg-gray-400 hover:text-white transition"
            >
              Mifidiana rakitra
            </label>
            <input
              id="mp3"
              accept=".mp3"
              type="file"
              onChange={handleFileMp3}
              className="hidden"
            />
            <p className="mt-2 text-gray-600">
              {mp3Path ? mp3Path.name : "Tsy misy rakitra voafantina"}
            </p>
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600"
          >
            Manamarina
          </button>
        </div>
      </div>
      <div className="md:mt-5">
        <Footer />
      </div>
    </main>
  );
}
