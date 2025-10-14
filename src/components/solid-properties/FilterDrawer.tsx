import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FilterState } from "@/pages/SoldProperties";

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCities: string[];
}

const propertyTypes = ["RESIDENTIAL", "COMMERCIAL", "AGRICULTURE", "NEW_DEVELOPMENT"];
const bedroomOptions = ["1", "2", "3", "4", "5+"];

const FilterDrawer = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  availableCities,
}: FilterDrawerProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const uniqueCities = Array.from(new Set(availableCities)).sort();

  const handleCityToggle = (city: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const handlePropertyTypeToggle = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleBedroomToggle = (bedroom: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(bedroom)
        ? prev.bedrooms.filter((b) => b !== bedroom)
        : [...prev.bedrooms, bedroom],
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClearAll = () => {
    const emptyFilters: FilterState = {
      cities: [],
      propertyTypes: [],
      minPrice: "",
      maxPrice: "",
      bedrooms: [],
      dateFrom: undefined,
      dateTo: undefined,
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
          <SheetDescription>
            Apply filters to refine your search results
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* City Filter */}
          <div>
            <Label className="text-base font-semibold mb-3 block">City</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {uniqueCities.map((city) => (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox
                    id={`city-${city}`}
                    checked={localFilters.cities.includes(city)}
                    onCheckedChange={() => handleCityToggle(city)}
                  />
                  <label
                    htmlFor={`city-${city}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {city}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Property Type Filter */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Property Type</Label>
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.propertyTypes.includes(type)}
                    onCheckedChange={() => handlePropertyTypeToggle(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Price Range (INR)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                  Min Price
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                  Max Price
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Bedrooms</Label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((bedroom) => (
                <div key={bedroom} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bedroom-${bedroom}`}
                    checked={localFilters.bedrooms.includes(bedroom)}
                    onCheckedChange={() => handleBedroomToggle(bedroom)}
                  />
                  <label
                    htmlFor={`bedroom-${bedroom}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {bedroom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Sold Date Range</Label>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localFilters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateFrom ? (
                        format(localFilters.dateFrom, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateFrom}
                      onSelect={(date) =>
                        setLocalFilters((prev) => ({ ...prev, dateFrom: date }))
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                  To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localFilters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateTo ? (
                        format(localFilters.dateTo, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateTo}
                      onSelect={(date) =>
                        setLocalFilters((prev) => ({ ...prev, dateTo: date }))
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClearAll} className="flex-1">
            Clear All
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
