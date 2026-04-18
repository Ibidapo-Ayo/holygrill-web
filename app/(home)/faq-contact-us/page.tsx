"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const faqs = [
  { question: "How fast is delivery?", answer: "Average delivery time is 20 minutes within campus. Pickup orders are ready in 10-15 minutes." },
  { question: "Do I earn Holy Points?", answer: "Yes. Every order earns HP automatically. Stay signed in to stack points and redeem rewards." },
  { question: "Where can I pick up?", answer: "Pickup is available at the Akure campus hub. You can also choose delivery to your lodge or lecture hall." },
];

export default function FaqContactPage() {
  return (
    <div className="container grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">FAQs</p>
          <h1 className="font-display text-3xl font-bold">Answers before you order</h1>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((item, idx) => (
            <AccordionItem key={item.question} value={`item-${idx}`} className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-base font-semibold text-foreground">{item.question}</AccordionTrigger>
              <AccordionContent className="pb-4 text-sm text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-xl font-semibold text-foreground">Need help?</h2>
        <p className="mb-4 text-sm text-muted-foreground">Send us a message and the team will reach out quickly.</p>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              rows={4}
              placeholder="How can we help?"
            />
          </div>
          <Button type="submit" className="w-full">
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}
