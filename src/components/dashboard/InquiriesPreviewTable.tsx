import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface PropertyInquiry {
  id: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  description: string;
  propertyType: string;
  address: string;
  area: number;
  createdAt: string;
}

interface InquiriesPreviewTableProps {
  inquiries: PropertyInquiry[];
}

const InquiriesPreviewTable = ({ inquiries }: InquiriesPreviewTableProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h2 className="text-lg font-semibold text-foreground">Recent Property Selling Inquiries</h2>
        <Button
          variant="link"
          onClick={() => navigate("/inquiries")}
          className="text-primary hover:text-primary/80 w-fit"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{inquiry.ownerName}</p>
                  {inquiry.description && (
                    <p className="text-xs text-muted-foreground mt-1">{inquiry.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`tel:${inquiry.ownerPhone}`)}
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {inquiry.propertyType.split(' - ')[0]}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground">Area</p>
                  <p className="font-medium tabular-nums">
                    {inquiry.area.toLocaleString()} sq ft
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <a
                    href={`mailto:${inquiry.ownerEmail}`}
                    className="text-sm text-muted-foreground hover:text-primary truncate"
                  >
                    {inquiry.ownerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <a
                    href={`tel:${inquiry.ownerPhone}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {inquiry.ownerPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{inquiry.address}</span>
                <span>{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Owner Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Contact</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Property Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Location</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Area</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Submitted</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <p className="font-medium text-foreground">{inquiry.ownerName}</p>
                    {inquiry.description && (
                      <p className="text-xs text-muted-foreground mt-1">{inquiry.description}</p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <a
                      href={`mailto:${inquiry.ownerEmail}`}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {inquiry.ownerEmail}
                    </a>
                    <a
                      href={`tel:${inquiry.ownerPhone}`}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {inquiry.ownerPhone}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {inquiry.propertyType.split(' - ')[0]}
                    </span>
                    {inquiry.propertyType.includes(' - ') && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {inquiry.propertyType.split(' - ')[1]}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-foreground">{inquiry.address}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-medium text-foreground tabular-nums">
                    {inquiry.area.toLocaleString()} sq ft
                  </p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${inquiry.ownerPhone}`)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inquiries.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground">No inquiries available</p>
        </div>
      )}
    </Card>
  );
};

export default InquiriesPreviewTable;
