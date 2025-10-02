import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("freelancer");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { name, email, password, role });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch(err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
        <input 
          type="text" placeholder="Name" 
          value={name} onChange={e=>setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input 
          type="email" placeholder="Email" 
          value={email} onChange={e=>setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input 
          type="password" placeholder="Password" 
          value={password} onChange={e=>setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <select value={role} onChange={e=>setRole(e.target.value)} className="border p-2 rounded">
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
