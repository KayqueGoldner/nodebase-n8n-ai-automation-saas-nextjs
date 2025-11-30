import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { WorflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";

const WorkflowsPage = async () => {
  await requireAuth();

  prefetchWorkflows();

  return (
    <WorflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorflowsContainer>
  )
}

export default WorkflowsPage;