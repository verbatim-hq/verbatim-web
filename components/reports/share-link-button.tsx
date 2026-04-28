"use client";

import * as React from "react";
import { toast } from "sonner";
import { Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateShareLinkAction } from "@/app/projects/actions";

export function ShareLinkButton({ projectId }: { projectId: string }) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="min-h-11 px-4"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            const url = await generateShareLinkAction({ projectId });
            await navigator.clipboard.writeText(url);
            toast.success("Link copied");
          } catch {
            toast.error("Couldn’t generate link");
          }
        });
      }}
    >
      <LinkIcon className="size-4" />
      Share link
    </Button>
  );
}

