import { useEffect, useState } from "react";
import { api } from "../api";
import JobCard from "../components/JobCard";

export default function FreelancerDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs").then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      {jobs.map(job => <JobCard key={job._id} job={job} />)}
    </div>
  );
}
