import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Users, DollarSign, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "E-commerce Website Development",
      description: "Need a full e-commerce platform with payment integration",
      budget: "$15,000",
      skills: ["React", "Node.js", "Stripe"],
      proposals: 12,
      status: "Active"
    },
    {
      id: 2,
      title: "Mobile App Design",
      description: "Looking for modern UI/UX design for iOS and Android app",
      budget: "$4,000",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      proposals: 8,
      status: "Active"
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    budget: "",
    skills: ""
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job = {
      id: jobs.length + 1,
      title: newJob.title,
      description: newJob.description,
      budget: newJob.budget,
      skills: newJob.skills.split(",").map(s => s.trim()),
      proposals: 0,
      status: "Active"
    };
    setJobs([job, ...jobs]);
    setNewJob({ title: "", description: "", budget: "", skills: "" });
    setIsDialogOpen(false);
    toast.success("Job posted successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/research")}>
              Market Insights
            </Button>
            <div className="text-sm text-muted-foreground">
              {user.name || user.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Posted Jobs</h1>
            <p className="text-muted-foreground">Manage your job listings and find talent</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Fill in the details to attract the best freelancers
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Full Stack Developer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project requirements..."
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $5,000 - $10,000"
                    value={newJob.budget}
                    onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, TypeScript"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Post Job
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-6">Start by posting your first job to find talented freelancers</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-[var(--shadow-elegant)] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{job.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Budget: {job.budget}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.proposals} Proposals
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline">View Proposals</Button>
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
