import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div className="text-xl font-bold">
        <Link to="/">Freelance Research Hub</Link>
      </div>
      <div className="space-x-4">
        <Link to="/freelancer">Freelancer</Link>
        <Link to="/client">Client</Link>
        <Link to="/research">Research</Link>
        <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
}
