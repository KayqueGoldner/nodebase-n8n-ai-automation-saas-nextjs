import { SearchParams } from "nuqs";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import {
  ExecutionsContainer,
  ExecutionsError,
  ExecutionsList,
  ExecutionsLoading,
} from "@/features/executions/components/executions";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";

interface ExecutionsPageProps {
  searchParams: Promise<SearchParams>;
}

const ExecutionsPage = async ({ searchParams }: ExecutionsPageProps) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);
  prefetchExecutions(params);

  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer>
  )
}

export default ExecutionsPage;
