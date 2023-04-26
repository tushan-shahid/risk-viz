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
      text: "Risk Ratings by Year",
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
  const year = data.map((d) => d.Year);
  const riskRatings = data.map((d) => d["Risk Rating"]);

  const chartData = {
    labels: year,
    datasets: [
      {
        label: "Risk Rating",
        data: riskRatings,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};

export default RiskLineGraph;
