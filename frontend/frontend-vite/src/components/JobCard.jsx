export default function JobCard({ job }) {
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>{job.description}</p>
      <p>Budget: ${job.budget}</p>
      <p>Posted by: {job.postedBy?.name}</p>
    </div>
  );
}
