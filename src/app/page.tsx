"use client"

import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { LogoutButton } from "@/app/logout";
import { Button } from "@/components/ui/button";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.getWorkflows.queryOptions()
  );

  const testAi = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: () => {
        toast.success("AI Job queued!");
      }
    }),
  );

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued!");
      },
    })
  );

  return (
    <div>
      Protected route
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      <Button
        onClick={() => testAi.mutate()}
        disabled={testAi.isPending}
      >
        Test AI
      </Button>
      <Button
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        Create Worflow
      </Button>

      <LogoutButton />
    </div>
  );
}
