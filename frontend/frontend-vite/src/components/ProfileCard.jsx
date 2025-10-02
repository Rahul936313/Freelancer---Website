export default function ProfileCard({ user }) {
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p>Role: {user.role}</p>
      <p>Skills: {user.skills?.join(", ")}</p>
      <p>Hourly Rate: ${user.hourlyRate}</p>
    </div>
  );
}
