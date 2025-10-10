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
  Mail
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
import { inquiriesAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  inquiryType: 'VIEWING_REQUEST' | 'PRICE_NEGOTIATION' | 'MORE_INFO' | 'CALL_BACK';
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';
  property?: {
    id: number;
    propertyTitle: string;
    price: number;
  };
  user: {
    id: number;
    fullName: string;
  };
  createdAt: string;
  adminResponse: string | null;
  respondedAt: string | null;
}

const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const { toast } = useToast();

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const response = await inquiriesAPI.getAll();
      setInquiries(response.data);
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
      (inquiry.property?.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    toast({
      title: 'Feature Coming Soon',
      description: `View details for inquiry #${inquiry.id} will be implemented.`,
      variant: 'default',
    });
  };

  const handleQuickStatusUpdate = (inquiry: Inquiry, newStatus: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: `Update status to ${newStatus} for inquiry #${inquiry.id} will be implemented.`,
      variant: 'default',
    });
  };

  const handleRespond = (inquiry: Inquiry) => {
    toast({
      title: 'Feature Coming Soon',
      description: `Respond to inquiry #${inquiry.id} will be implemented.`,
      variant: 'default',
    });
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
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inquiries Management
          </h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and responses
          </p>
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
                        <span className="font-medium">{inquiry.property?.propertyTitle || 'Unknown Property'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.property ? formatPrice(inquiry.property.price) : 'N/A'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(inquiry.inquiryType)}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(inquiry)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRespond(inquiry)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    </div>
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