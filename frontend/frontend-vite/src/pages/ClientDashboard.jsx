import { useEffect, useState } from "react";
import { api } from "../api";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";

export default function ClientDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs").then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Posted Jobs</h1>
        <Link to="/post-job" className="bg-blue-500 px-3 py-1 rounded text-white">Post Job</Link>
      </div>
      {jobs.map(job => <JobCard key={job._id} job={job} />)}
    </div>
  );
}
