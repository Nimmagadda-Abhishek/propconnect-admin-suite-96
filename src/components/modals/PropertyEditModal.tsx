import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Upload, Image, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { propertiesAPI } from '@/services/api';

interface PropertyImage {
  imageUrl: string;
  isPrimary: boolean;
}

interface PropertyData {
  id: number;
  propertyTitle: string;
  price: number;
  propertyType: string;
  listingType: string;
  propertyDescription?: string;
  fullAddress: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  carpetArea?: string;
  builtUpArea?: string;
  floors?: number;
  totalFloors?: number;
  propertyAge?: number;
  furnishing?: string;
  amenities?: string;
  parkingAvailable: boolean;
  parkingSpots?: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  youtubeVideoUrl?: string;
  instagramProfile?: string;
  listingStatus?: string;
  propertyImages?: PropertyImage[];
}

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyData | null;
  onPropertyUpdated: () => void;
}

const AMENITIES_OPTIONS = [
  'Swimming Pool', 'Gym', 'Garden', 'Security', 'Power Backup', 
  'Elevator', 'Parking', 'Club House', 'Playground', 'CCTV',
  'Intercom', 'Fire Safety', 'Waste Disposal', 'Rain Water Harvesting',
  'Solar Panels', 'Wi-Fi', 'DTH', 'Maintenance Staff'
];

const PROPERTY_TYPES = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'NEW_DEVELOPMENT', label: 'New Development' },
  { value: 'AGRICULTURE', label: 'Agriculture' }
];

const LISTING_TYPES = [
  { value: 'SALE', label: 'Sale' },
  { value: 'RESALE', label: 'Resale' },
  { value: 'RENT', label: 'Rent' }
];

const FURNISHING_OPTIONS = [
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi Furnished' },
  { value: 'UNFURNISHED', label: 'Unfurnished' }
];

const LISTING_STATUS_OPTIONS = [
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'FEATURED', label: 'Featured' },
  { value: 'RECENT', label: 'Recent' }
];

export function PropertyEditModal({ isOpen, onClose, property, onPropertyUpdated }: PropertyEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [formData, setFormData] = useState<Partial<PropertyData>>({});

  useEffect(() => {
    if (property) {
      setFormData({
        propertyTitle: property.propertyTitle || '',
        price: property.price || 0,
        propertyType: property.propertyType || '',
        listingType: property.listingType || '',
        propertyDescription: property.propertyDescription || '',
        fullAddress: property.fullAddress || '',
        locality: property.locality || '',
        city: property.city || '',
        state: property.state || '',
        pincode: property.pincode || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || '',
        carpetArea: property.carpetArea || '',
        builtUpArea: property.builtUpArea || '',
        floors: property.floors || 0,
        totalFloors: property.totalFloors || 0,
        propertyAge: property.propertyAge || 0,
        furnishing: property.furnishing || '',
        parkingAvailable: property.parkingAvailable || false,
        parkingSpots: property.parkingSpots || 0,
        contactName: property.contactName || '',
        contactPhone: property.contactPhone || '',
        contactEmail: property.contactEmail || '',
        youtubeVideoUrl: property.youtubeVideoUrl || '',
        instagramProfile: property.instagramProfile || '',
        listingStatus: property.listingStatus || ''
      });

      // Parse amenities
      if (property.amenities) {
        const amenitiesArray = property.amenities.split(',').map(a => a.trim());
        setSelectedAmenities(amenitiesArray);
      } else {
        setSelectedAmenities([]);
      }

      // Set existing images
      setExistingImages(property.propertyImages || []);
    }
  }, [property]);

  const handleInputChange = (field: keyof PropertyData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    // Validation
    const requiredFields = ['propertyTitle', 'price', 'propertyType', 'listingType', 'fullAddress', 'locality', 'city', 'state', 'pincode', 'contactName', 'contactPhone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof PropertyData]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Please fill in required fields: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add amenities as comma-separated string
      formDataToSend.append('amenities', selectedAmenities.join(', '));

      // Add new images
      newImages.forEach((file, index) => {
        formDataToSend.append('newImages', file);
      });

      // Add existing images info (if needed by backend)
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      const response = await propertiesAPI.update(property.id, formDataToSend);
      const result = response.data;
      
      toast({
        title: 'Success',
        description: result.message || 'Property updated successfully',
        variant: 'default',
      });

      onPropertyUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating property:', error);
      
      let errorMessage = 'Update failed, please try again';
      if (error.message.includes('400')) {
        errorMessage = 'Invalid data provided. Please check your inputs.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Property not found';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Connection failed. Please check your internet connection.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property - {property.propertyTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="propertyTitle">Property Title *</Label>
                    <Input
                      id="propertyTitle"
                      value={formData.propertyTitle || ''}
                      onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                      placeholder="Enter property title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select value={formData.propertyType || ''} onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="listingType">Listing Type *</Label>
                      <Select value={formData.listingType || ''} onValueChange={(value) => handleInputChange('listingType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LISTING_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="propertyDescription">Description</Label>
                    <Textarea
                      id="propertyDescription"
                      value={formData.propertyDescription || ''}
                      onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                      placeholder="Enter property description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullAddress">Full Address *</Label>
                    <Input
                      id="fullAddress"
                      value={formData.fullAddress || ''}
                      onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                      placeholder="Enter full address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="locality">Locality *</Label>
                      <Input
                        id="locality"
                        value={formData.locality || ''}
                        onChange={(e) => handleInputChange('locality', e.target.value)}
                        placeholder="Enter locality"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode || ''}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Enter pincode"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms || ''}
                        onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                        placeholder="Number of bedrooms"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms || ''}
                        onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                        placeholder="Number of bathrooms"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        value={formData.area || ''}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="e.g., 1200 sq ft"
                      />
                    </div>

                    <div>
                      <Label htmlFor="carpetArea">Carpet Area</Label>
                      <Input
                        id="carpetArea"
                        value={formData.carpetArea || ''}
                        onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                        placeholder="e.g., 1000 sq ft"
                      />
                    </div>

                    <div>
                      <Label htmlFor="builtUpArea">Built-up Area</Label>
                      <Input
                        id="builtUpArea"
                        value={formData.builtUpArea || ''}
                        onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                        placeholder="e.g., 1200 sq ft"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="floors">Floors</Label>
                      <Input
                        id="floors"
                        type="number"
                        value={formData.floors || ''}
                        onChange={(e) => handleInputChange('floors', parseInt(e.target.value))}
                        placeholder="Current floor"
                      />
                    </div>

                    <div>
                      <Label htmlFor="totalFloors">Total Floors</Label>
                      <Input
                        id="totalFloors"
                        type="number"
                        value={formData.totalFloors || ''}
                        onChange={(e) => handleInputChange('totalFloors', parseInt(e.target.value))}
                        placeholder="Total floors in building"
                      />
                    </div>

                    <div>
                      <Label htmlFor="propertyAge">Property Age</Label>
                      <Input
                        id="propertyAge"
                        type="number"
                        value={formData.propertyAge || ''}
                        onChange={(e) => handleInputChange('propertyAge', parseInt(e.target.value))}
                        placeholder="Age in years"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="furnishing">Furnishing</Label>
                    <Select value={formData.furnishing || ''} onValueChange={(value) => handleInputChange('furnishing', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select furnishing" />
                      </SelectTrigger>
                      <SelectContent>
                        {FURNISHING_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {AMENITIES_OPTIONS.map(amenity => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Parking */}
              <Card>
                <CardHeader>
                  <CardTitle>Parking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parkingAvailable"
                      checked={formData.parkingAvailable || false}
                      onCheckedChange={(checked) => handleInputChange('parkingAvailable', checked)}
                    />
                    <Label htmlFor="parkingAvailable">Parking Available</Label>
                  </div>

                  {formData.parkingAvailable && (
                    <div>
                      <Label htmlFor="parkingSpots">Number of Parking Spots</Label>
                      <Input
                        id="parkingSpots"
                        type="number"
                        value={formData.parkingSpots || ''}
                        onChange={(e) => handleInputChange('parkingSpots', parseInt(e.target.value))}
                        placeholder="Number of parking spots"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName || ''}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Enter contact name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone || ''}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="Enter contact phone"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="Enter contact email"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="youtubeVideoUrl">YouTube Video URL</Label>
                    <Input
                      id="youtubeVideoUrl"
                      value={formData.youtubeVideoUrl || ''}
                      onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
                      placeholder="Enter YouTube video URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagramProfile">Instagram Profile</Label>
                    <Input
                      id="instagramProfile"
                      value={formData.instagramProfile || ''}
                      onChange={(e) => handleInputChange('instagramProfile', e.target.value)}
                      placeholder="Enter Instagram profile"
                    />
                  </div>

                  <div>
                    <Label htmlFor="listingStatus">Listing Status</Label>
                    <Select value={formData.listingStatus || ''} onValueChange={(value) => handleInputChange('listingStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing status" />
                      </SelectTrigger>
                      <SelectContent>
                        {LISTING_STATUS_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div>
                      <Label>Existing Images</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {existingImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.imageUrl}
                              alt={`Property ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              {image.isPrimary && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Primary
                                </Badge>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeExistingImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            {!image.isPrimary && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute bottom-2 left-2 text-xs"
                                onClick={() => setPrimaryImage(index, true)}
                              >
                                Set Primary
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Upload */}
                  <div>
                    <Label htmlFor="newImages">Add New Images</Label>
                    <Input
                      id="newImages"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2"
                    />
                  </div>

                  {/* New Images Preview */}
                  {newImages.length > 0 && (
                    <div>
                      <Label>New Images Preview</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {newImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => removeNewImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Property'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
