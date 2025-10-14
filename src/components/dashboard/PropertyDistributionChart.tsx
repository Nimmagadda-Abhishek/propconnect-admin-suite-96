import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PropertyDistributionChartProps {
  data: {
    active: number;
    sold: number;
    rented: number;
    inactive: number;
    underReview: number;
    total: number;
  };
}

const COLORS = {
  active: "hsl(var(--chart-1))",
  sold: "hsl(var(--chart-2))",
  rented: "hsl(var(--chart-3))",
  inactive: "hsl(var(--chart-4))",
  underReview: "hsl(var(--chart-5))",
};

const PropertyDistributionChart = ({ data }: PropertyDistributionChartProps) => {
  const chartData = [
    { name: "Active", value: data.active, color: COLORS.active },
    { name: "Sold", value: data.sold, color: COLORS.sold },
    { name: "Rented", value: data.rented, color: COLORS.rented },
    { name: "Inactive", value: data.inactive, color: COLORS.inactive },
    { name: "Under Review", value: data.underReview, color: COLORS.underReview },
  ].filter(item => item.value > 0);

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / data.total) * 100).toFixed(0);
    return `${percent}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} properties ({((payload[0].value / data.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Property Distribution by Status</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={120}
              innerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm fill-muted-foreground font-medium"
            >
              Total Properties
            </text>
            <text
              x="50%"
              y="52%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl fill-foreground font-bold"
            >
              {data.total}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PropertyDistributionChart;
