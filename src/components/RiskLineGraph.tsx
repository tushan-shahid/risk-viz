import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CsvData } from "../app/page";
import { ChartOptions } from "chart.js/auto";

Chart.register(LineController, LineElement, PointElement, LinearScale);

interface RiskLineGraphProps {
  data: CsvData[];
  selectedCategory: string;
}

const RiskLineGraph: React.FC<RiskLineGraphProps> = ({
  data,
  selectedCategory,
}) => {
  const filteredData = data.filter(
    (item) =>
      selectedCategory === "All" ||
      item["Business Category"] === selectedCategory
  );

  const aggregatedData: { [year: number]: number[] } = {};

  filteredData.forEach((item) => {
    if (!aggregatedData[item.Year]) {
      aggregatedData[item.Year] = [];
    }
    aggregatedData[item.Year].push(item["Risk Rating"]);
  });

  const chartData = {
    labels: Object.keys(aggregatedData).map((year) => +year),
    datasets: [
      {
        label: "Risk Rating",
        data: Object.values(aggregatedData).map(
          (riskRatings) =>
            riskRatings.reduce((a, b) => a + b, 0) / riskRatings.length
        ),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "linear",
      },
    },
  };
  return <Line data={chartData} options={options} />;
};

export default RiskLineGraph;
