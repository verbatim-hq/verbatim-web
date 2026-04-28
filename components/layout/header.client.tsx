"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { createPortalSessionAction } from "@/app/billing/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BillingMenu({ tier }: { tier: "free" | "pro" }) {
  const [pending, startTransition] = React.useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-h-11 px-4" disabled={pending}>
          <CreditCard className="size-4" />
          Billing
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled className="meta text-[var(--text-faint)]">
          Tier: {tier.toUpperCase()}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={tier !== "pro" || pending}
          onSelect={(e) => {
            e.preventDefault();
            startTransition(async () => {
              try {
                const url = await createPortalSessionAction({ returnPath: "/projects" });
                window.location.assign(url);
              } catch {
                toast.error("Couldn’t open billing portal");
              }
            });
          }}
        >
          Manage subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

