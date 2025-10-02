import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Freelance Research Hub</h1>
      <p className="mb-6 text-center max-w-xl">Connect with talented freelancers or post research-driven projects. Explore trends and make data-driven decisions.</p>
      <div className="space-x-4">
        <Link to="/signup" className="bg-blue-500 px-4 py-2 rounded text-white">Sign Up</Link>
        <Link to="/login" className="bg-green-500 px-4 py-2 rounded text-white">Login</Link>
      </div>
    </div>
  );
}
