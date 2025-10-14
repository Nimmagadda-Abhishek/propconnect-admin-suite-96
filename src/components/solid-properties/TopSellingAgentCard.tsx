import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Trophy } from "lucide-react";
import { TopSellingAgent } from "@/pages/SoldProperties";

interface TopSellingAgentCardProps {
  agent: TopSellingAgent;
  onViewProperties: (agentId: number) => void;
}

const TopSellingAgentCard = ({ agent, onViewProperties }: TopSellingAgentCardProps) => {
  return (
    <Card className="p-6 mb-6 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-foreground">Top Selling Agent</h3>
            </div>
            
            <p className="text-2xl font-bold text-foreground mb-2">{agent.agentName}</p>
            
            <Badge className="bg-yellow-500 text-white mb-3">
              {agent.soldCount} Properties Sold
            </Badge>
            
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={`mailto:${agent.agentEmail}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                {agent.agentEmail}
              </a>
              <a
                href={`tel:${agent.agentPhone}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                {agent.agentPhone}
              </a>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => onViewProperties(agent.agentId)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          View All Properties
        </Button>
      </div>
    </Card>
  );
};

export default TopSellingAgentCard;
