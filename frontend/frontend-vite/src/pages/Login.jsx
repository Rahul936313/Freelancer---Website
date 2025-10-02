import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      // Redirect based on role
      if(res.data.user.role === "freelancer") navigate("/freelancer");
      else navigate("/client");
    } catch(err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
        <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
