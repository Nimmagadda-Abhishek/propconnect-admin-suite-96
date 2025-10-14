import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Eye, 
  CheckCircle,
  Phone,
  Mail,
  User,
  Building
} from 'lucide-react';

interface Property {
  id: number;
  propertyTitle: string;
  price: number;
  propertyType: string;
  listingType: string;
  fullAddress: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  amenities: string;
  propertyImages: Array<{
    imageUrl: string;
    isPrimary: boolean;
  }>;
  agentId?: number;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  latitude: number;
  longitude: number;
  viewCount: number;
  isVerified: boolean;
  createdAt: string;
}

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onViewAgentProperties?: (agentId: number) => void;
}

export function PropertyModal({ isOpen, onClose, property, onViewAgentProperties }: PropertyModalProps) {
  if (!property) return null;

  const amenitiesList = property.amenities ? property.amenities.split(',').map(a => a.trim()) : [];
  const primaryImage = property.propertyImages?.find(img => img.isPrimary)?.imageUrl || 
                       property.propertyImages?.[0]?.imageUrl;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {property.propertyTitle}
            {property.isVerified && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Images */}
            {primaryImage && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={primaryImage} 
                  alt={property.propertyTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-2xl text-primary">
                    {formatPrice(property.price)}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline">{property.propertyType}</Badge>
                    <Badge variant="secondary">{property.listingType}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.fullAddress}, {property.city}</span>
                </div>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-muted-foreground" />
                    <span>{property.area}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Agent Information */}
            {property.agentId ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Agent Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">{property.agentName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${property.agentPhone}`}
                      className="text-primary hover:underline"
                    >
                      {property.agentPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${property.agentEmail}`}
                      className="text-primary hover:underline"
                    >
                      {property.agentEmail}
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAgentProperties?.(property.agentId!)}
                    className="w-full"
                  >
                    View Agent Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Agent Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No agent assigned to this property</p>
                </CardContent>
              </Card>
            )}

            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Property Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{property.viewCount} Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${property.isVerified ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span>{property.isVerified ? 'Verified Property' : 'Unverified'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Map integration coming soon
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {property.latitude}, Lng: {property.longitude}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}