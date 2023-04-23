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
  const [filterDecade, setFilterDecade] = useState<number | null>(null);
  const [sortByRiskRating, setSortByRiskRating] = useState<
    "asc" | "desc" | null
  >(null);

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

  const handleDecadeFilter = (decade: number) => {
    if (filterDecade === decade) {
      setFilterDecade(null);
    } else {
      setFilterDecade(decade);
    }
  };

  const toggleRiskRatingSort = () => {
    setSortByRiskRating(sortByRiskRating === "asc" ? "desc" : "asc");
  };

  const displayData = data
    .filter((row) => {
      if (filterTags.length === 0) {
        return true;
      } else {
        return filterTags.some((tag) => row["Risk Factors"].includes(tag));
      }
    })
    .filter((row) => {
      if (filterDecade === null) {
        return true;
      } else {
        return Math.floor(row.Year / 10) * 10 === filterDecade;
      }
    })
    .sort((a, b) => {
      if (sortByRiskRating === "asc") {
        return a["Risk Rating"] - b["Risk Rating"];
      } else if (sortByRiskRating === "desc") {
        return b["Risk Rating"] - a["Risk Rating"];
      } else {
        return 0;
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
  const decades = [2030, 2040, 2050, 2060, 2070];

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
      <div>
        <p className="text-black">Filter by Decade</p>
        {decades.map((decade) => (
          <button
            key={decade}
            onClick={() => handleDecadeFilter(decade)}
            className={`${
              filterDecade === decade ? "bg-gray-500" : "bg-gray-300"
            } px-2 py-1 rounded-lg mr-2 mb-2`}
          >
            {decade}
          </button>
        ))}
      </div>

      <div>
        <p className="text-black">Sort by Risk Rating</p>
        <button
          onClick={toggleRiskRatingSort}
          className="px-2 py-1 rounded-lg mr-2 mb-2"
        >
          {sortByRiskRating === "asc" ? "Descending" : "Ascending"}
        </button>
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
