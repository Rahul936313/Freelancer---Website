import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ResearchChart({ data }) {
  const chartData = {
    labels: data.map(d => d.title),
    datasets: [{
      label: "Value",
      data: data.map(d => d.value),
      backgroundColor: "rgba(59,130,246,0.7)"
    }]
  };

  return <Bar data={chartData} />;
}
