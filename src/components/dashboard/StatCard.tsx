import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "success" | "destructive" | "info" | "muted";
  trend?: "up" | "down";
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: "border-l-4 border-l-primary",
  success: "border-l-4 border-l-success",
  destructive: "border-l-4 border-l-destructive",
  info: "border-l-4 border-l-info",
  muted: "border-l-4 border-l-muted-foreground",
};

const iconBgStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  muted: "bg-muted text-muted-foreground",
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  onClick,
  className,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300",
        variantStyles[variant],
        onClick && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
