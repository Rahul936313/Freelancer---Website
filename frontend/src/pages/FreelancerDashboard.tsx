import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, DollarSign, MapPin, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [jobs] = useState([
    {
      id: 1,
      title: "Full Stack Developer Needed",
      description: "Looking for an experienced developer to build a modern web application with React and Node.js",
      budget: "$5,000 - $10,000",
      duration: "2-3 months",
      location: "Remote",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      postedBy: "Tech Startup Inc.",
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "UI/UX Designer for Mobile App",
      description: "Need a creative designer to redesign our mobile application interface",
      budget: "$3,000 - $5,000",
      duration: "1 month",
      location: "Remote",
      skills: ["Figma", "UI Design", "Mobile Design", "Prototyping"],
      postedBy: "FinTech Solutions",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "Content Writer - Technology Blog",
      description: "Seeking a talented writer to create engaging content for our tech blog",
      budget: "$500 - $1,000",
      duration: "Ongoing",
      location: "Remote",
      skills: ["Content Writing", "SEO", "Technology", "Research"],
      postedBy: "Digital Media Co.",
      postedDate: "3 days ago"
    },
    {
      id: 4,
      title: "Python Data Analyst",
      description: "Analyze large datasets and create insightful visualizations for business intelligence",
      budget: "$4,000 - $7,000",
      duration: "2 months",
      location: "Remote",
      skills: ["Python", "Pandas", "Data Visualization", "SQL"],
      postedBy: "Analytics Corp",
      postedDate: "5 days ago"
    }
  ]);

  const handleApply = (jobTitle: string) => {
    toast.success(`Application submitted for: ${jobTitle}`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity</p>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-[var(--shadow-elegant)] transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-base">{job.description}</CardDescription>
                  </div>
                  <Button onClick={() => handleApply(job.title)}>
                    Apply Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.budget}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm">
                      Posted by <span className="font-medium">{job.postedBy}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{job.postedDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
