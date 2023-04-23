import React, { useState } from "react";
import { CsvData } from "../app/page";

interface TableProps {
  data: CsvData[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Table: React.FC<TableProps> = ({ data, currentPage, setCurrentPage }) => {
  const recordsPerPage = 100;

  const [filterTags, setFilterTags] = useState<string[]>([]);

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

  const displayData = data
    .filter((row) => {
      if (filterTags.length === 0) {
        return true;
      } else {
        return filterTags.some((tag) => row["Risk Factors"].includes(tag));
      }
    })
    .slice(currentPage * recordsPerPage, (currentPage + 1) * recordsPerPage);

  const uniqueRiskFactors = Array.from(
    new Set(
      data.flatMap((row) =>
        row["Risk Factors"].split(", ").map((item) => {
          const trimmedItem = item.trim();
          const startIndex = trimmedItem.indexOf('"');
          const endIndex = trimmedItem.lastIndexOf('"');
          return trimmedItem.substring(startIndex + 1, endIndex);
        })
      )
    )
  ).sort();

  const handleFilterTagClick = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter((t) => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  return (
    <>
      <div>
        <p className="text-black">Filter by Risk Factor</p>
        {uniqueRiskFactors.map((tag) => (
          <button
            key={tag}
            onClick={() => handleFilterTagClick(tag)}
            className={`${
              filterTags.includes(tag) ? "bg-gray-500" : "bg-gray-300"
            } px-2 py-1 rounded-lg mr-2 mb-2`}
          >
            {tag}
          </button>
        ))}
      </div>

      <table className="text-black m-2">
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
          {displayData.map((row, index) => (
            <tr key={index}>
              <td>{row["Asset Name"]}</td>
              <td>{row.Lat}</td>
              <td>{row.Long}</td>
              <td>{row["Business Category"]}</td>
              <td>{row["Risk Rating"]}</td>
              <td>{row["Risk Factors"]}</td>
              <td>{row.Year}</td>
            </tr>
          ))}
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
