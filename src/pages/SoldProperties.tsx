import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Filter, Download, RefreshCw, Search, X } from "lucide-react";
import TopSellingAgentCard from "@/components/solid-properties/TopSellingAgentCard";
import SoldPropertiesTable from "@/components/solid-properties/SoldPropertiesTable";
import FilterDrawer from "@/components/solid-properties/FilterDrawer";
import { Skeleton } from "@/components/ui/skeleton";

export interface SoldProperty {
  propertyId: number;
  propertyTitle: string;
  price: number;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURE" | "NEW_DEVELOPMENT";
  listingType: string;
  city: string;
  locality: string;
  fullAddress: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  soldBy: {
    agentId: number;
    agentName: string;
    agentEmail: string;
    agentPhone: string;
    agentUsername: string;
    agentStatus: string;
    totalSoldByAgent: number;
  };
}

export interface TopSellingAgent {
  agentId: number;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  soldCount: number;
}

interface SoldPropertiesData {
  totalSold: number;
  topSellingAgent: TopSellingAgent;
  soldProperties: SoldProperty[];
}

export interface FilterState {
  cities: string[];
  propertyTypes: string[];
  minPrice: string;
  maxPrice: string;
  bedrooms: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

const SoldProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<SoldPropertiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    propertyTypes: [],
    minPrice: "",
    maxPrice: "",
    bedrooms: [],
    dateFrom: undefined,
    dateTo: undefined,
  });

  const agentId = searchParams.get("agentId");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(

        "https://3b0024836e23.ngrok-free.app/api/admin/dashboard/sold-properties",

        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch sold properties");

      const result = await response.json();
      setData(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sold properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!data?.soldProperties) return [];

    let result = [...data.soldProperties];

    // Agent filter
    if (agentId) {
      result = result.filter((p) => p.soldBy.agentId === parseInt(agentId));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.propertyTitle.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.locality.toLowerCase().includes(query) ||
          p.soldBy.agentName.toLowerCase().includes(query)
      );
    }

    // City filter
    if (filters.cities.length > 0) {
      result = result.filter((p) => filters.cities.includes(p.city));
    }

    // Property type filter
    if (filters.propertyTypes.length > 0) {
      result = result.filter((p) => filters.propertyTypes.includes(p.propertyType));
    }

    // Price range filter
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      result = result.filter((p) => filters.bedrooms.includes(p.bedrooms.toString()));
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter((p) => new Date(p.updatedAt) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter((p) => new Date(p.updatedAt) <= filters.dateTo!);
    }

    return result;
  }, [data?.soldProperties, agentId, searchQuery, filters]);

  const handleClearAgentFilter = () => {
    searchParams.delete("agentId");
    setSearchParams(searchParams);
  };

  const handleAgentClick = (agentId: number) => {
    setSearchParams({ agentId: agentId.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportToCSV = () => {
    if (!filteredProperties.length) return;

    const headers = [
      "Property ID",
      "Title",
      "Price",
      "Type",
      "City",
      "Locality",
      "Bedrooms",
      "Bathrooms",
      "Area",
      "Sold Date",
      "Agent Name",
      "Agent Email",
      "Agent Phone",
    ];

    const rows = filteredProperties.map((p) => [
      p.propertyId,
      p.propertyTitle,
      p.price,
      p.propertyType,
      p.city,
      p.locality,
      p.bedrooms,
      p.bathrooms,
      p.area,
      new Date(p.updatedAt).toLocaleDateString(),
      p.soldBy.agentName,
      p.soldBy.agentEmail,
      p.soldBy.agentPhone,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sold-properties-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Sold properties have been exported to CSV.",
    });
  };

  const agentName = agentId
    ? data?.soldProperties.find((p) => p.soldBy.agentId === parseInt(agentId))?.soldBy.agentName
    : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Sold Properties</h1>
              {!loading && data && (
                <Badge variant="default" className="bg-chart-success text-white">
                  {filteredProperties.length} Properties
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={fetchData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => setFilterDrawerOpen(true)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Agent Filter Banner */}
        {agentId && agentName && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                Filtered by Agent: <span className="font-bold">{agentName}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAgentFilter}
                className="text-blue-900 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Top Selling Agent Card */}
        {loading ? (
          <Skeleton className="h-40 mb-6" />
        ) : (
          data?.topSellingAgent && (
            <TopSellingAgentCard
              agent={data.topSellingAgent}
              onViewProperties={handleAgentClick}
            />
          )
        )}

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, city, locality, agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Properties Table */}
        {loading ? (
          <Card className="p-6">
            <Skeleton className="h-96" />
          </Card>
        ) : filteredProperties.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg font-semibold mb-2">No sold properties found</p>
              <p className="text-sm">Properties marked as sold will appear here</p>
            </div>
          </Card>
        ) : (
          <SoldPropertiesTable
            properties={filteredProperties}
            onAgentClick={handleAgentClick}
          />
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        filters={filters}
        onFiltersChange={setFilters}
        availableCities={data?.soldProperties.map((p) => p.city) || []}
      />
    </main>
  );
};

export default SoldProperties;
