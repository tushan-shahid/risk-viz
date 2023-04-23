// pages/index.tsx
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
  const [showTable, setShowTable] = useState(false); // Add this state variable to conditionally render the table
  const [selectedDecade, setSelectedDecade] = useState(2030); // Set the initial value to 2000

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

  return (
    <div>
      <h1>Home</h1>
      <div>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <button onClick={handleShowTable}>
        {showTable ? "Hide Table" : "Show Table"}
      </button>
      {/* Conditionally render the Table component */}
      {showTable && csvData && (
        <Table
          data={csvData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      {/* Add a decade selector */}
      <div>
        <label htmlFor="decade-select">Select decade:</label>
        <select
          name="decade-select"
          id="decade-select"
          value={selectedDecade}
          onChange={(e) => {
            const newDecade = parseInt(e.target.value, 10);
            setSelectedDecade(newDecade);
            console.log("Selected decade:", newDecade);
          }}
        >
          <option value="2030">2030s</option>
          <option value="2040">2040s</option>
          <option value="2050">2050s</option>
          <option value="2060">2060s</option>
          <option value="2070">2070s</option>
        </select>
      </div>
      {/* Render the Map component */}
      {csvData && <Map data={csvData} selectedDecade={selectedDecade} />}
    </div>
  );
};

export default HomePage;
