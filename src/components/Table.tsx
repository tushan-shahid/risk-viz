// components/Table.tsx

import React from "react";
import { CsvData } from "../app/page";

interface TableProps {
  data: CsvData[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Table: React.FC<TableProps> = ({ data, currentPage, setCurrentPage }) => {
  const recordsPerPage = 100;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * recordsPerPage < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const displayData = data.slice(
    currentPage * recordsPerPage,
    (currentPage + 1) * recordsPerPage
  );

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Business Category</th>
            <th>Risk Rating</th>
            <th>Risk Factors</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map(
            (
              row,
              index // Use displayData instead of data
            ) => (
              <tr key={index}>
                <td>{row["Asset Name"]}</td>
                <td>{row.Lat}</td>
                <td>{row.Long}</td>
                <td>{row["Business Category"]}</td>
                <td>{row["Risk Rating"]}</td>
                <td>{row["Risk Factors"]}</td>
                <td>{row.Year}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div>
        <button onClick={handlePrevPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </>
  );
};

export default Table;
