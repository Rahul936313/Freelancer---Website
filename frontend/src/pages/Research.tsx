import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Research = () => {
  const navigate = useNavigate();

  const skillsDemandData = [
    { name: "React", demand: 4500 },
    { name: "Node.js", demand: 3800 },
    { name: "Python", demand: 4200 },
    { name: "UI/UX", demand: 3200 },
    { name: "Data Science", demand: 2900 },
    { name: "Mobile Dev", demand: 2500 }
  ];

  const projectTrendsData = [
    { month: "Jan", projects: 1200 },
    { month: "Feb", projects: 1450 },
    { month: "Mar", projects: 1700 },
    { month: "Apr", projects: 1900 },
    { month: "May", projects: 2100 },
    { month: "Jun", projects: 2400 }
  ];

  const categoryDistribution = [
    { name: "Web Development", value: 35, color: "hsl(217, 91%, 60%)" },
    { name: "Mobile Apps", value: 20, color: "hsl(142, 76%, 36%)" },
    { name: "Design", value: 18, color: "hsl(280, 70%, 55%)" },
    { name: "Data & AI", value: 15, color: "hsl(30, 90%, 55%)" },
    { name: "Other", value: 12, color: "hsl(0, 0%, 60%)" }
  ];

  const averageRatesData = [
    { skill: "Senior Dev", rate: 120 },
    { skill: "Mid Dev", rate: 80 },
    { skill: "Junior Dev", rate: 50 },
    { skill: "Designer", rate: 70 },
    { skill: "Writer", rate: 40 }
  ];

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
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Market Insights & Trends</h1>
          </div>
          <p className="text-muted-foreground">Real-time analytics for the freelance economy</p>
        </div>

        <div className="grid gap-6">
          {/* Skills in Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Top Skills in Demand</CardTitle>
              <CardDescription>Most requested skills by clients this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsDemandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Project Growth Trends</CardTitle>
              <CardDescription>Number of new projects posted over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--secondary))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Project Categories</CardTitle>
                <CardDescription>Distribution of project types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average Hourly Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Average Hourly Rates</CardTitle>
                <CardDescription>Market rates by skill level ($/hour)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={averageRatesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="skill" type="category" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Key Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-primary mb-2">🚀 Fastest Growing</h4>
                  <p className="text-sm text-muted-foreground">
                    React and Python continue to dominate with 35% growth in demand quarter-over-quarter
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary mb-2">💰 Highest Paying</h4>
                  <p className="text-sm text-muted-foreground">
                    Senior developers and data scientists command premium rates averaging $120+/hour
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">📈 Market Trend</h4>
                  <p className="text-sm text-muted-foreground">
                    Overall freelance market growing 18% annually with web development leading the way
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Research;
