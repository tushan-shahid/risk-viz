"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import Table from "../components/Table";
import Map from "../components/Map";

export interface CsvData {
  "Asset Name": string;
  Lat: number;
  Long: number;
  "Business Category": string;
  "Risk Rating": number;
  "Risk Factors": string;
  Year: number;
}

const HomePage: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvData[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState(2030);
  const [showMap, setShowMap] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvData>(file, {
      header: true,
      complete: (result) => {
        setCsvData(result.data);
      },
    });
  };

  const handleShowTable = () => {
    if (csvData) {
      setShowTable(!showTable);
    } else {
      alert("Please upload a CSV file.");
    }
  };
  const handleShowMap = () => {
    if (csvData) {
      setShowMap(!showMap);
    } else {
      alert("Please upload a CSV file.");
    }
  };

  return (
    <div className="p-4 bg-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
        Risk Viz
      </h1>
      <div className="mb-4 flex justify-center">
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          className="py-2 px-4 rounded-md bg-blue-500 text-white font-bold"
        />
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handleShowTable}
          className="py-2 px-4 rounded-md bg-blue-500 text-white font-bold"
        >
          {showTable ? "Hide Table" : "Show Table"}
        </button>
        <button
          onClick={handleShowMap}
          className="py-2 px-4 rounded-md bg-blue-500 text-white font-bold"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>
      {showTable && csvData && (
        <Table
          data={csvData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      {showMap && csvData && (
        <Map data={csvData} selectedDecade={selectedDecade} />
      )}
      {showMap && csvData && (
        <div className="flex justify-center mb-4 mt-3">
          <label htmlFor="decade-select" className="mr-2 py-2 text-black">
            Select decade:
          </label>
          <select
            name="decade-select"
            id="decade-select"
            value={selectedDecade}
            onChange={(e) => {
              const newDecade = parseInt(e.target.value, 10);
              setSelectedDecade(newDecade);
            }}
            className="py-2 px-4  rounded-md bg-white text-blue-900 font-bold"
          >
            <option value="2030">2030s</option>
            <option value="2040">2040s</option>
            <option value="2050">2050s</option>
            <option value="2060">2060s</option>
            <option value="2070">2070s</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default HomePage;
