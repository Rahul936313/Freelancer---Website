import { useEffect, useState } from "react";
import { api } from "../api";
import ResearchChart from "../components/ResearchChart";

export default function ResearchDashboard() {
  const [research, setResearch] = useState([]);

  useEffect(() => {
    api.get("/research").then(res => setResearch(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Research Dashboard</h1>
      <ResearchChart data={research} />
    </div>
  );
}
