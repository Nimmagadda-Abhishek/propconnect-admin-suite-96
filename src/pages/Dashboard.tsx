import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  User, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Eye,
  Settings,
  Download,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dashboardAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProperties: number;
  totalAgents: number;
  totalUsers: number;
  totalInquiries: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalAgents: 0,
    totalUsers: 0,
    totalInquiries: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/properties',
      trend: '+12%',
    },
    {
      title: 'Total Agents',
      value: stats.totalAgents,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      link: '/agents',
      trend: '+5%',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: User,
      color: 'text-success',
      bgColor: 'bg-success/10',
      link: '/users',
      trend: '+18%',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      link: '/inquiries',
      trend: '+25%',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New property listing',
      details: '3BHK Apartment in Banjara Hills',
      timestamp: '2 minutes ago',
      type: 'property',
    },
    {
      id: 2,
      action: 'Agent registration',
      details: 'John Smith joined as agent',
      timestamp: '15 minutes ago',
      type: 'agent',
    },
    {
      id: 3,
      action: 'Inquiry received',
      details: 'User interested in Luxury Villa',
      timestamp: '30 minutes ago',
      type: 'inquiry',
    },
    {
      id: 4,
      action: 'Property updated',
      details: 'Price updated for Commercial Space',
      timestamp: '1 hour ago',
      type: 'property',
    },
    {
      id: 5,
      action: 'User registration',
      details: 'New user signed up',
      timestamp: '2 hours ago',
      type: 'user',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Agent',
      description: 'Register a new property agent',
      icon: Plus,
      action: () => {
        // This would open the agent creation modal
        toast({
          title: 'Feature Coming Soon',
          description: 'Agent creation modal will be implemented.',
          variant: 'default',
        });
      },
      variant: 'default' as const,
    },
    {
      title: 'View All Properties',
      description: 'Browse all property listings',
      icon: Eye,
      action: () => window.location.href = '/properties',
      variant: 'secondary' as const,
    },
    {
      title: 'Manage Inquiries',
      description: 'Handle customer inquiries',
      icon: Settings,
      action: () => window.location.href = '/inquiries',
      variant: 'default' as const,
    },
    {
      title: 'Export Reports',
      description: 'Download monthly summary',
      icon: Download,
      action: () => {
        toast({
          title: 'Export Started',
          description: 'Your report is being generated...',
          variant: 'default',
        });
      },
      variant: 'outline' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to PropConnect Admin
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage your property management platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="hover:shadow-medium transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        {card.value.toLocaleString()}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <div key={action.title} className="flex items-center justify-between p-4 rounded-lg border hover:bg-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <action.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button 
                  variant={action.variant} 
                  size="sm"
                  onClick={action.action}
                >
                  Action
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card-hover transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;