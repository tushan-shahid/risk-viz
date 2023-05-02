import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CsvData } from "@/pages";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: CsvData[];
}

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Risk Ratings by Year and Business Category",
    },
  },
  scales: {
    x: {
      type: "category",
      title: {
        display: true,
        text: "Year",
      },
    },
    y: {
      title: {
        display: true,
        text: "Risk Rating",
      },
    },
  },
};

const RiskLineGraph: React.FC<ChartProps> = ({ data }) => {
  // Group data by business category
  const categoriesData = data.reduce<Record<string, CsvData[]>>((acc, row) => {
    if (!acc[row["Business Category"]]) {
      acc[row["Business Category"]] = [];
    }
    acc[row["Business Category"]].push(row);
    return acc;
  }, {});

  // Get all the years from the data
  const yearsSet = new Set(data.map((d) => d.Year));
  const years = Array.from(yearsSet).sort((a, b) => a - b);

  // Create a dataset for each business category
  const datasets = Object.keys(categoriesData).map((category) => {
    const categoryData = categoriesData[category];

    const categoryYears = categoryData.map((d: { Year: any }) => d.Year);
    const riskRatings = categoryData.map(
      (d: { [x: string]: any }) => d["Risk Rating"]
    );

    return {
      label: category,
      data: years.map((year) => {
        const index = categoryYears.indexOf(year);
        return index !== -1 ? riskRatings[index] : null;
      }),
      fill: false,
      borderColor: `hsl(${Math.random() * 360}, 75%, 50%)`,
      tension: 0.4,
    };
  });

  const chartData = {
    labels: years,
    datasets,
  };

  return <Line options={options} data={chartData} />;
};

export default RiskLineGraph;
