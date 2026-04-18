import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  { id: "HG-1023", customer: "Adewale J.", total: "₦7,400", status: "Preparing" },
  { id: "HG-1024", customer: "Chinedu O.", total: "₦4,200", status: "On route" },
  { id: "HG-1025", customer: "Funmilayo A.", total: "₦3,600", status: "Delivered" },
];

export default function AdminOrdersPage() {
  return (
    <Card className="border-border/70 bg-card">
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{order.id}</p>
              <p className="text-sm text-muted-foreground">{order.customer}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{order.total}</Badge>
              <Badge>{order.status}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
