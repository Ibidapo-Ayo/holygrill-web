import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminMenuPage() {
  return (
    <Card className="border-border/70 bg-card">
      <CardHeader>
        <CardTitle>Create menu item</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Holy Combo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="₦4,800" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={3} placeholder="Juicy grilled beef with suya aioli." />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">Save draft</Button>
          <Button>Publish</Button>
        </div>
      </CardContent>
    </Card>
  );
}
