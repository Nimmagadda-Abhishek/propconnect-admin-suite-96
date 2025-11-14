import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Heart,
  Droplet,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  location?: string;
  address?: string;
  panUlr?: string;
  aadharUrl?: string;
  age?: number;
  bloodGroup?: string;
  dateOfBirth?: string;
  experience?: number;
}

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgent = async () => {
    try {
      setIsLoading(true);
      const response = await agentsAPI.getById(parseInt(id!));
      setAgent(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch agent details.',
        variant: 'destructive',
      });
      navigate('/agents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      SUSPENDED: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/agents')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Agent #{agent.id}
          </h1>
          <p className="text-muted-foreground">
            Detailed view of agent information
          </p>
        </div>
      </div>

      {/* Agent Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold">{agent.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {agent.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {agent.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {agent.phoneNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">{getStatusBadge(agent.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(agent.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Experience</label>
              <p className="text-lg">{agent.experience ? `${agent.experience} years` : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {agent.location || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                {agent.address || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Age</label>
              <p className="text-lg">{agent.age || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
              <p className="flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                {agent.bloodGroup || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {agent.dateOfBirth ? new Date(agent.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            {(agent.panUlr || agent.aadharUrl) && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Documents</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {agent.panUlr && (
                    <div className="border rounded-lg p-2">
                      <p className="text-sm font-medium mb-2">PAN Card</p>
                      <img
                        src={agent.panUlr}
                        alt="PAN Card"
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  {agent.aadharUrl && (
                    <div className="border rounded-lg p-2">
                      <p className="text-sm font-medium mb-2">Aadhaar Card</p>
                      <img
                        src={agent.aadharUrl}
                        alt="Aadhaar Card"
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDetail;
