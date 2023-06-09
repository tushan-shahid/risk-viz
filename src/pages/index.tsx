import React, { useState } from "react";
import Papa from "papaparse";
import Table from "../components/Table";
import Map from "../components/Map";
import RiskLineGraph from "../components/RiskLineGraph";

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
  const [showRiskLineGraph, setShowRiskLineGraph] = useState(false);

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

  const toggleComponent = (component: string) => {
    if (csvData) {
      if (component === "table") {
        setShowTable(!showTable);
      } else if (component === "map") {
        setShowMap(!showMap);
      } else if (component === "riskLineGraph") {
        setShowRiskLineGraph(!showRiskLineGraph);
      }
    } else {
      alert("Please upload a CSV file.");
    }
  };

  return (
    <div className="p-4 bg-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
        Risk Viz
      </h1>
      <p className="text-center text-blue-800 mb-4">
        Upload a CSV file containing columns: Asset Name, Lat, Long, Business
        Category, Risk Rating, Risk Factors, Year. Click the buttons below to
        visualize the data.
      </p>
      <div className="mb-4 flex justify-center">
        <label htmlFor="file" className="mr-2 py-2 text-black">
          Upload CSV file:
        </label>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          className="py-2 px-4 rounded-md bg-blue-500 text-white font-bold"
        />
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        {[
          { label: "Table", state: showTable, component: "table" },
          { label: "Map", state: showMap, component: "map" },
          {
            label: "Risk Line Graph",
            state: showRiskLineGraph,
            component: "riskLineGraph",
          },
        ].map(({ label, state, component }) => (
          <button
            key={label}
            onClick={() => toggleComponent(component)}
            className="py-2 px-4 rounded-md bg-blue-500 text-white font-bold"
          >
            {state ? `Hide ${label}` : `Show ${label}`}
          </button>
        ))}
      </div>
      {showRiskLineGraph && csvData && (
        <div className="mt-8">
          <RiskLineGraph data={csvData} />
        </div>
      )}

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
            className="py-2 px-4 rounded-md bg-white text-blue-900 font-bold"
          >
            {["2030", "2040", "2050", "2060", "2070"].map((decade) => (
              <option key={decade} value={decade}>
                {decade}s
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default HomePage;
