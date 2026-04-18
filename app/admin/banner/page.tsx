import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminBannerPage() {
  return (
    <Card className="border-border/70 bg-card">
      <CardHeader>
        <CardTitle>Homepage banner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" placeholder="Every meal, every point, every moment." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta">CTA label</Label>
          <Input id="cta" placeholder="Order now" />
        </div>
        <Button>Save banner</Button>
      </CardContent>
    </Card>
  );
}
