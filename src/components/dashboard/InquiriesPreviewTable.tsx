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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Property Selling Inquiries</h2>
        <Button 
          variant="link" 
          onClick={() => navigate("/inquiries")}
          className="text-primary hover:text-primary/80"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="overflow-x-auto">
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
                  <p className="font-medium text-foreground">{inquiry.ownerName}</p>
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
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {inquiry.propertyType}
                  </span>
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No inquiries available</p>
        </div>
      )}
    </Card>
  );
};

export default InquiriesPreviewTable;
