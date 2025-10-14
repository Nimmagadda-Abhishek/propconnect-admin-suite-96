import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AgentPerformanceCardProps {
  title: string;
  agentName: string;
  agentEmail?: string;
  agentPhone?: string;
  count: number;
  countLabel: string;
  variant?: "default" | "gold" | "muted";
  showViewButton?: boolean;
  agentId?: number;
}

const variantStyles = {
  default: "border-l-4 border-l-success",
  gold: "border-l-4 border-l-gold bg-gradient-to-br from-gold/5 to-transparent",
  muted: "border-l-4 border-l-muted-foreground",
};

const AgentPerformanceCard = ({
  title,
  agentName,
  agentEmail,
  agentPhone,
  count,
  countLabel,
  variant = "default",
  showViewButton,
  agentId,
}: AgentPerformanceCardProps) => {
  const navigate = useNavigate();

  const handleViewProperties = () => {
    if (agentId) {
      navigate(`/sold-properties?agentId=${agentId}`);
    }
  };

  return (
    <Card className={cn("p-6 transition-all duration-300 hover:shadow-lg", variantStyles[variant])}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        {variant === "gold" && <Trophy className="w-5 h-5 text-gold" />}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-foreground mb-1">{agentName}</h4>
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
            variant === "gold" ? "bg-gold text-gold-foreground" : "bg-primary text-primary-foreground"
          )}>
            {count} {countLabel}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {agentEmail && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${agentEmail}`} className="hover:text-primary transition-colors">
              {agentEmail}
            </a>
          </div>
        )}
        {agentPhone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <a href={`tel:${agentPhone}`} className="hover:text-primary transition-colors">
              {agentPhone}
            </a>
          </div>
        )}
      </div>

      {showViewButton && (
        <Button 
          onClick={handleViewProperties}
          className="w-full" 
          variant={variant === "gold" ? "default" : "outline"}
        >
          View Sold Properties
        </Button>
      )}
    </Card>
  );
};

export default AgentPerformanceCard;
