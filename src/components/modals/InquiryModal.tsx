import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { inquiriesAPI } from '@/services/api';
import { 
  User, 
  Building, 
  MessageSquare, 
  Calendar, 
  Phone, 
  Mail,
  IndianRupee
} from 'lucide-react';

interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  inquiryType: string;
  status: string;
  property: {
    id: number;
    propertyTitle: string;
    price: number;
  };
  user: {
    id: number;
    fullName: string;
  };
  agentId?: number;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  createdAt: string;
  adminResponse?: string;
  respondedAt?: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CLOSED', label: 'Closed' },
];

const INQUIRY_TYPES = {
  'VIEWING_REQUEST': 'Viewing Request',
  'PRICE_NEGOTIATION': 'Price Negotiation', 
  'MORE_INFO': 'More Information',
  'CALL_BACK': 'Call Back Request'
};

export function InquiryModal({ isOpen, onClose, inquiry, onSuccess }: InquiryModalProps) {
  const [status, setStatus] = useState(inquiry?.status || 'NEW');
  const [response, setResponse] = useState(inquiry?.adminResponse || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setResponse(inquiry.adminResponse || '');
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await inquiriesAPI.updateStatus(inquiry.id, status, response);
      toast({
        title: "Success",
        description: "Inquiry updated successfully",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update inquiry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500';
      case 'CONTACTED': return 'bg-yellow-500';
      case 'IN_PROGRESS': return 'bg-orange-500';
      case 'CLOSED': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Inquiry Details #{inquiry.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">{inquiry.fullName}</p>
                <p className="text-sm text-muted-foreground">User ID: {inquiry.user.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${inquiry.phoneNumber}`}
                  className="text-primary hover:underline"
                >
                  {inquiry.phoneNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${inquiry.email}`}
                  className="text-primary hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">{inquiry.property.propertyTitle}</p>
                <p className="text-sm text-muted-foreground">Property ID: {inquiry.property.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-primary">
                  {formatPrice(inquiry.property.price)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Details */}
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {INQUIRY_TYPES[inquiry.inquiryType as keyof typeof INQUIRY_TYPES] || inquiry.inquiryType}
                  </Badge>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Message:</p>
                <p className="text-sm bg-muted p-3 rounded-md">{inquiry.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status & Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Response</label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response to the inquiry..."
                  rows={4}
                />
              </div>

              {inquiry.adminResponse && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Previous Response</label>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">{inquiry.adminResponse}</p>
                    {inquiry.respondedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded on: {new Date(inquiry.respondedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} disabled={loading}>
            {loading ? 'Updating...' : 'Update Inquiry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}