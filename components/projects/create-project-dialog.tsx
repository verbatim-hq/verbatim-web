"use client";

import * as React from "react";

import { createProjectAction } from "@/app/projects/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateProjectDialog() {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (formData: FormData) => {
    const name = String(formData.get("name") ?? "");
    const description = String(formData.get("description") ?? "");

    setError(null);
    startTransition(async () => {
      try {
        await createProjectAction({
          name,
          description: description.length ? description : undefined,
        });
        setOpen(false);
      } catch {
        setError("Couldn’t create the project. Try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-5">Create new project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            A project is where interviews live. Start simple—you can refine later.
          </DialogDescription>
        </DialogHeader>

        <form action={onSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Onboarding research"
              required
              minLength={1}
              maxLength={120}
              disabled={pending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What decision will this research support?"
              maxLength={600}
              disabled={pending}
            />
          </div>

          {error && <p className="text-sm text-[var(--color-orange)]">{error}</p>}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

