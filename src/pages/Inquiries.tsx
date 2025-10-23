import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Eye,
  Clock,
  CheckCircle,
  User,
  Building2,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { inquiriesAPI, agentsAPI, propertiesAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  inquiryType: 'VIEWING_REQUEST' | 'PRICE_NEGOTIATION' | 'MORE_INFO' | 'CALL_BACK';
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';
  propertyId: number;
  propertyTitle: string;
  propertyCity: string;
  agentId?: number;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  userId: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string | null;
  respondedAt?: string | null;
}

const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const response = await inquiriesAPI.getAll();
      const inquiriesData = response.data;

      // Enrich inquiries with agent information from properties
      const enrichedInquiries = await Promise.all(
        inquiriesData.map(async (inquiry: Inquiry) => {
          try {
            const propertyResponse = await propertiesAPI.getById(inquiry.propertyId);
            const property = propertyResponse.data;
            return {
              ...inquiry,
              agentId: property.agentId,
              agentName: property.agentName,
              agentPhone: property.agentPhone,
              agentEmail: property.agentEmail,
            };
          } catch (error) {
            console.error(`Failed to fetch property details for inquiry ${inquiry.id}:`, error);
            return inquiry; // Return inquiry without agent info if property fetch fails
          }
        })
      );

      setInquiries(enrichedInquiries);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch inquiries data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || inquiry.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || inquiry.inquiryType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      NEW: 'destructive',
      CONTACTED: 'secondary',
      IN_PROGRESS: 'default',
      CLOSED: 'outline'
    } as const;
    
    const icons = {
      NEW: Clock,
      CONTACTED: MessageSquare,
      IN_PROGRESS: Clock,
      CLOSED: CheckCircle
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      VIEWING_REQUEST: 'default',
      PRICE_NEGOTIATION: 'secondary',
      MORE_INFO: 'outline',
      CALL_BACK: 'destructive'
    } as const;
    
    return (
      <Badge variant={colors[type as keyof typeof colors] || 'default'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };



  const handleViewAgentDetails = async (agentId: number) => {
    try {
      const response = await agentsAPI.getById(agentId);
      const agent = response.data;

      toast({
        title: `Agent: ${agent.fullName}`,
        description: `Email: ${agent.email}\nPhone: ${agent.phoneNumber}\nStatus: ${agent.status}`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch agent details.',
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    navigate(`/inquiries/${inquiry.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Inquiries Management
            </h1>
            <p className="text-muted-foreground">
              Manage customer inquiries and responses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span>{filteredInquiries.length} inquiries</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name, property, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="VIEWING_REQUEST">Viewing Request</SelectItem>
                  <SelectItem value="PRICE_NEGOTIATION">Price Negotiation</SelectItem>
                  <SelectItem value="MORE_INFO">More Info</SelectItem>
                  <SelectItem value="CALL_BACK">Call Back</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inquiries ({filteredInquiries.length})</CardTitle>
          <CardDescription>
            All customer inquiries and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Inquiry Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">#{inquiry.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{inquiry.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{inquiry.phoneNumber}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{inquiry.propertyTitle || 'Unknown Property'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.propertyCity || 'N/A'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {inquiry.agentId ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{inquiry.agentName || 'Unknown Agent'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{inquiry.agentEmail || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{inquiry.agentPhone || 'N/A'}</span>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => inquiry.agentId && handleViewAgentDetails(inquiry.agentId)}
                        >
                          View Details
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No Agent Assigned</span>
                    )}
                  </TableCell>
                  <TableCell>{getTypeBadge(inquiry.inquiryType)}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(inquiry)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredInquiries.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inquiries found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inquiries;