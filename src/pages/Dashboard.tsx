import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, User, MessageSquare, TrendingUp, CheckCircle, Key, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import StatCard from "@/components/dashboard/StatCard";
import AgentPerformanceCard from "@/components/dashboard/AgentPerformanceCard";
import PropertyDistributionChart from "@/components/dashboard/PropertyDistributionChart";
import InquiriesPreviewTable from "@/components/dashboard/InquiriesPreviewTable";

interface DashboardStats {
  totalProperties: number;
  totalAgents: number;
  totalUsers: number;
  totalInquiries: number;
  activeProperties: number;
  soldProperties: number;
  rentedProperties: number;
  inactiveProperties: number;
  agentWithMostProperties: {
    agentId: number;
    agentName: string;
    propertyCount: number;
  };
  agentWithLeastProperties: {
    agentId: number;
    agentName: string;
    propertyCount: number;
  };
  agentWithMostSoldProperties: {
    agentId: number;
    agentName: string;
    agentEmail: string;
    agentPhone: string;
    soldCount: number;
  };
  propertyStatusBreakdown: {
    active: number;
    sold: number;
    rented: number;
    inactive: number;
    underReview: number;
    total: number;
  };
}

interface PropertyInquiry {
  id: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  description: string;
  propertyType: string;
  address: string;
  area: number;
  propertyAge: number;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const statsResponse = await fetch(

<<<<<<< Updated upstream
<<<<<<< Updated upstream
          "https://3b0024836e23.ngrok-free.app/admin/dashboard/stats",
=======
          "https://23adff71a200.ngrok-free.app/api/admin/dashboard/stats",
>>>>>>> Stashed changes
=======
          "https://23adff71a200.ngrok-free.app/api/admin/dashboard/stats",
>>>>>>> Stashed changes
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch property inquiries
        const inquiriesResponse = await fetch(

<<<<<<< Updated upstream
<<<<<<< Updated upstream
          "https://3b0024836e23.ngrok-free.app/api/properties1",
=======
          "https://23adff71a200.ngrok-free.app/api/properties1",
>>>>>>> Stashed changes
=======
          "https://23adff71a200.ngrok-free.app/api/properties1",
>>>>>>> Stashed changes

          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!inquiriesResponse.ok) {
          throw new Error("Failed to fetch property inquiries");
        }

        const inquiriesData = await inquiriesResponse.json();
        // Sort by createdAt descending and take top 5
        const sortedInquiries = inquiriesData
          .sort((a: PropertyInquiry, b: PropertyInquiry) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);
        setInquiries(sortedInquiries);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);



  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No data available</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
          {/* Section 1: Statistics Cards Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Total Properties"
                value={stats.totalProperties}
                icon={Building2}
                variant="default"
                onClick={() => navigate("/properties")}
              />
              <StatCard
                title="Total Agents"
                value={stats.totalAgents}
                icon={Users}
                variant="default"
                onClick={() => navigate("/agents")}
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={User}
                variant="default"
                onClick={() => navigate("/users")}
              />
              <StatCard
                title="Total Inquiries"
                value={stats.totalInquiries}
                icon={MessageSquare}
                variant="default"
                onClick={() => navigate("/inquiries")}
              />
              <StatCard
                title="Active Properties"
                value={stats.activeProperties}
                icon={TrendingUp}
                variant="success"
                onClick={() => navigate("/properties?status=active")}
              />
              <StatCard
                title="Sold Properties"
                value={stats.soldProperties}
                icon={CheckCircle}
                variant="destructive"
                onClick={() => navigate("/sold-properties")}
              />
              <StatCard
                title="Rented Properties"
                value={stats.rentedProperties}
                icon={Key}
                variant="info"
                onClick={() => navigate("/properties?status=rented")}
              />
              <StatCard
                title="Inactive Properties"
                value={stats.inactiveProperties}
                icon={Pause}
                variant="muted"
                onClick={() => navigate("/properties?status=inactive")}
              />
            </div>
          </section>

          {/* Section 2: Agent Performance Cards */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Top Performing Agents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AgentPerformanceCard
                title="Top Agent (All Properties)"
                agentName={stats.agentWithMostProperties.agentName}
                count={stats.agentWithMostProperties.propertyCount}
                countLabel="Properties"
                variant="default"
              />
              <AgentPerformanceCard
                title="🏆 Top Selling Agent"
                agentName={stats.agentWithMostSoldProperties.agentName}
                agentEmail={stats.agentWithMostSoldProperties.agentEmail}
                agentPhone={stats.agentWithMostSoldProperties.agentPhone}
                count={stats.agentWithMostSoldProperties.soldCount}
                countLabel="Sold"
                variant="gold"
                showViewButton
                agentId={stats.agentWithMostSoldProperties.agentId}
              />
              <AgentPerformanceCard
                title="Newest Agent"
                agentName={stats.agentWithLeastProperties.agentName}
                count={stats.agentWithLeastProperties.propertyCount}
                countLabel="Properties"
                variant="muted"
              />
            </div>
          </section>

          {/* Section 3: Property Status Distribution Chart */}
          <section>
            <PropertyDistributionChart data={stats.propertyStatusBreakdown} />
          </section>

          {/* Section 4: Property Inquiries Preview */}
          <section>
            <InquiriesPreviewTable inquiries={inquiries} />
          </section>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
