import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Mail, Phone, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SoldProperty } from "@/pages/SoldProperties";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

interface SoldPropertiesTableProps {
  properties: SoldProperty[];
  onAgentClick: (agentId: number) => void;
}

type SortField = "price" | "updatedAt" | "propertyTitle";
type SortDirection = "asc" | "desc";

const propertyTypeBadgeStyles = {
  RESIDENTIAL: "bg-blue-100 text-blue-800 border-blue-200",
  COMMERCIAL: "bg-purple-100 text-purple-800 border-purple-200",
  AGRICULTURE: "bg-green-100 text-green-800 border-green-200",
  NEW_DEVELOPMENT: "bg-orange-100 text-orange-800 border-orange-200",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const SoldPropertiesTable = ({ properties, onAgentClick }: SoldPropertiesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedProperties = useMemo(() => {
    if (!sortField) return properties;

    return [...properties].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case "propertyTitle":
          aValue = a.propertyTitle.toLowerCase();
          bValue = b.propertyTitle.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [properties, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = sortedProperties.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold uppercase">ID</TableHead>
              <TableHead
                className="text-xs font-semibold uppercase cursor-pointer"
                onClick={() => handleSort("propertyTitle")}
              >
                <div className="flex items-center">
                  Property Title
                  {getSortIcon("propertyTitle")}
                </div>
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Price
                  {getSortIcon("price")}
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase">Type</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Location</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Details</TableHead>
              <TableHead
                className="text-xs font-semibold uppercase cursor-pointer"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center">
                  Sold Date
                  {getSortIcon("updatedAt")}
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase">Sold By</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProperties.map((property) => (
              <TableRow key={property.propertyId} className="hover:bg-muted/50">
                <TableCell className="text-sm text-muted-foreground">
                  #{property.propertyId}
                </TableCell>
                <TableCell className="font-medium max-w-xs">
                  {property.propertyTitle}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {formatPrice(property.price)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={propertyTypeBadgeStyles[property.propertyType]}
                  >
                    {property.propertyType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{property.city}</span>
                    <span className="text-muted-foreground text-xs">{property.locality}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {property.bedrooms} BHK | {property.bathrooms} Bath | {property.area} sq ft
                </TableCell>
                <TableCell className="text-sm" title={formatDistanceToNow(new Date(property.updatedAt), { addSuffix: true })}>
                  {format(new Date(property.updatedAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onAgentClick(property.soldBy.agentId)}
                    className="text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    {property.soldBy.agentName}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${property.soldBy.agentPhone}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Call agent"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`mailto:${property.soldBy.agentEmail}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Email agent"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedProperties.length)} of{" "}
            {sortedProperties.length} results
          </span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
};

export default SoldPropertiesTable;
