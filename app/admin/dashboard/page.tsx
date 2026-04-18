import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartNoAxesColumn, Flame, ShoppingBag, Users } from "lucide-react";

const metrics = [
  { label: "Active orders", value: "42", icon: ShoppingBag },
  { label: "Holy Points issued", value: "12.4K", icon: Flame },
  { label: "Unique customers", value: "3.1K", icon: Users },
  { label: "Avg. delivery", value: "18m", icon: ChartNoAxesColumn },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Quick pulse on campus operations.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-border/70 bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                <Icon size={18} className="text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
