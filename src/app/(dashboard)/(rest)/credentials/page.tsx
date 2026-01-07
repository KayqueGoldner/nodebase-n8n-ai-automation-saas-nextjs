import { SearchParams } from "nuqs";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import { requireAuth } from "@/lib/auth-utils";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import {
  CredentialsContainer,
  CredentialsError,
  CredentialsList,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";

interface CredentialsPageProps {
  searchParams: Promise<SearchParams>;
}

const CredentialsPage = async ({ searchParams }: CredentialsPageProps) => {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);
  prefetchCredentials(params);

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  )
}

export default CredentialsPage;
