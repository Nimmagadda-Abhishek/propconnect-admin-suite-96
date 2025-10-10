import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  User,
  Building2,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  propertyId: number;
  propertyTitle: string;
  propertyCity: string;
  userId: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string | null;
  respondedAt?: string | null;
}

const InquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInquiry = async () => {
    try {
      setIsLoading(true);
      const response = await inquiriesAPI.getAll();
      const foundInquiry = response.data.find((inq: Inquiry) => inq.id === parseInt(id!));
      if (foundInquiry) {
        setInquiry(foundInquiry);
      } else {
        toast({
          title: 'Inquiry not found',
          description: 'The requested inquiry could not be found.',
          variant: 'destructive',
        });
        navigate('/inquiries');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch inquiry details.',
        variant: 'destructive',
      });
      navigate('/inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiry();
  }, [id]);

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

  if (!inquiry) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/inquiries')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inquiries
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Inquiry #{inquiry.id}
          </h1>
          <p className="text-muted-foreground">
            Detailed view of customer inquiry
          </p>
        </div>
      </div>

      {/* Inquiry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold">{inquiry.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {inquiry.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {inquiry.phoneNumber}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Inquiry Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Inquiry Type</label>
              <div className="mt-1">{getTypeBadge(inquiry.inquiryType)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">{getStatusBadge(inquiry.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(inquiry.createdAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Property Title</label>
              <p className="text-lg font-semibold">{inquiry.propertyTitle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <p className="text-lg">{inquiry.propertyCity}</p>
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        <Card>
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{inquiry.message}</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Response */}
      {inquiry.adminResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Response</CardTitle>
            <CardDescription>
              Responded at {new Date(inquiry.respondedAt!).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{inquiry.adminResponse}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InquiryDetail;
