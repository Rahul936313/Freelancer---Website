import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/jobs", { title, description, budget });
      alert("Job posted successfully!");
      navigate("/client");
    } catch (err) {
      console.log(err);
      alert("Error posting job");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input 
          type="text" placeholder="Job Title" 
          value={title} onChange={e => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea 
          placeholder="Job Description" 
          value={description} onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input 
          type="number" placeholder="Budget" 
          value={budget} onChange={e => setBudget(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded">
          Post Job
        </button>
      </form>
    </div>
  );
}
