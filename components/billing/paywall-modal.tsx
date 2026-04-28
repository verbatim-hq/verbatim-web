"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCheckoutSessionAction } from "@/app/billing/actions";

export function PaywallModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-[26px] font-normal tracking-tight">
            Unlock unlimited research synthesis.
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            You’ve used your 2 free syntheses. Upgrade to Pro to keep uploading and
            synthesizing without interruption.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="mt-2 text-sm text-[var(--color-orange)]">{error}</p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button
            type="button"
            className="bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue)]"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  const url = await createCheckoutSessionAction({
                    returnPath: `/projects`,
                  });
                  window.location.assign(url);
                } catch {
                  setError("Couldn’t start checkout. Try again.");
                }
              });
            }}
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
                />
                Redirecting…
              </span>
            ) : (
              "Upgrade to Pro - $29/mo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

