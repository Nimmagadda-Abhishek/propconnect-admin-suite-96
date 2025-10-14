import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Building2, 
  MapPin,
  IndianRupee,
  MoreHorizontal
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { propertiesAPI, agentsAPI } from '@/services/api';
import { PropertyModal } from '@/components/modals/PropertyModal';
import { PropertyEditModal } from '@/components/modals/PropertyEditModal';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { toast } from '@/hooks/use-toast';

interface PropertyListItem {
  id: number;
  propertyTitle: string;
  price: number;
  propertyType: string;
  listingType: string;
  city: string;
  agentId: number;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  status: string;
  createdAt: string;
  viewCount: number;
  // Additional fields for detailed view
  fullAddress?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  amenities?: string;
  propertyImages?: Array<{imageUrl: string; isPrimary: boolean}>;
  latitude?: number;
  longitude?: number;
  isVerified?: boolean;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [propertyModal, setPropertyModal] = useState({ isOpen: false, property: null as PropertyListItem | null });
  const [editModal, setEditModal] = useState({ isOpen: false, property: null as PropertyListItem | null, isLoading: false });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, property: null as PropertyListItem | null });

  const fetchProperties = async (page = 0, size = 10) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        size,
        ...(typeFilter !== 'ALL' && { propertyType: typeFilter }),
        ...(searchQuery && { search: searchQuery }),
      };

      console.log('Properties API Call - Params:', params);
      console.log('Properties API Call - Full URL:', propertiesAPI.getAll.name || 'propertiesAPI.getAll');

      const response = await propertiesAPI.getAll(params);

      console.log('Properties API Response - Status:', response.status);
      console.log('Properties API Response - Data:', response.data);
      console.log('Properties API Response - Content length:', response.data.content?.length || 0);

      setProperties(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setCurrentPage(response.data.number || 0);
    } catch (error) {
      console.error('Properties API Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch properties data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [typeFilter, searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      RESIDENTIAL: 'default',
      COMMERCIAL: 'secondary',
      'NEW_DEVELOPMENT': 'outline',
      AGRICULTURE: 'destructive'
    } as const;
    
    return (
      <Badge variant={colors[type as keyof typeof colors] || 'default'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const getListingTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'SALE' ? 'default' : 'secondary'}>
        {type}
      </Badge>
    );
  };

  const handleViewProperty = async (property: PropertyListItem) => {
    try {
      // Fetch detailed property information
      const response = await propertiesAPI.getById(property.id);
      const detailedProperty = response.data;
      setPropertyModal({ isOpen: true, property: detailedProperty });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch property details.',
        variant: 'destructive',
      });
    }
  };

  const handleEditProperty = async (property: PropertyListItem) => {
    try {
      setEditModal({ isOpen: true, property: null, isLoading: true });
      
      // Fetch detailed property information for editing
      const response = await propertiesAPI.getById(property.id);
      const detailedProperty = response.data;
      
      setEditModal({ isOpen: true, property: detailedProperty, isLoading: false });
    } catch (error) {
      setEditModal({ isOpen: false, property: null, isLoading: false });
      toast({
        title: 'Error',
        description: 'Failed to load property data for editing.',
        variant: 'destructive',
      });
    }
  };

  const handlePropertyUpdated = () => {
    // Refresh the properties list after successful update
    fetchProperties(currentPage);
    setEditModal({ isOpen: false, property: null, isLoading: false });
  };

  const handleDeleteProperty = (property: PropertyListItem) => {
    toast({
      title: 'Feature Coming Soon',
      description: `Delete property ${property.propertyTitle} functionality will be implemented.`,
      variant: 'default',
    });
  };

  const handleViewAgentProperties = async (agentId: number) => {
    try {
      // Fetch detailed agent information
      const response = await agentsAPI.getById(agentId);
      const detailedAgent = response.data;

      // Show agent details in a modal or toast for now
      toast({
        title: `Agent: ${detailedAgent.fullName}`,
        description: `Email: ${detailedAgent.email}\nPhone: ${detailedAgent.phoneNumber}\nStatus: ${detailedAgent.status}`,
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
            Properties Management
          </h1>
          <p className="text-muted-foreground">
            Manage all property listings and their details
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="w-4 h-4" />
          <span>{properties.length} properties found</span>
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
                  placeholder="Search by property title or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('ALL')}
              >
                All Types
              </Button>
              <Button
                variant={typeFilter === 'RESIDENTIAL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('RESIDENTIAL')}
              >
                Residential
              </Button>
              <Button
                variant={typeFilter === 'COMMERCIAL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('COMMERCIAL')}
              >
                Commercial
              </Button>
              <Button
                variant={typeFilter === 'NEW_DEVELOPMENT' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('NEW_DEVELOPMENT')}
              >
                New Development
              </Button>
              <Button
                variant={typeFilter === 'AGRICULTURE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('AGRICULTURE')}
              >
                Agriculture
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Properties ({properties.length})</CardTitle>
          <CardDescription>
            All property listings in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Agent</TableHead>
                
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {property.propertyTitle}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {property.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(property.propertyType)}</TableCell>
                  <TableCell>{getListingTypeBadge(property.listingType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{property.city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {property.agentId ? (
                      <button
                        onClick={() => handleViewAgentProperties(property.agentId)}
                        className="text-primary hover:underline"
                      >
                        {property.agentName}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">No Agent</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProperty(property)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProperty(property)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProperty(property)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {properties.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No properties found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProperties(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProperties(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <PropertyModal
        isOpen={propertyModal.isOpen}
        onClose={() => setPropertyModal({ isOpen: false, property: null })}
        property={propertyModal.property}
      />

      <PropertyEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, property: null, isLoading: false })}
        property={editModal.property}
        onPropertyUpdated={handlePropertyUpdated}
      />
    </div>
  );
};

export default Properties;