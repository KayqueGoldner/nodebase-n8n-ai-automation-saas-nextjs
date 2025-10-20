"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const Client = () => {
  const trpc = useTRPC();

  const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Client Component</h1>
      <p className="text-lg text-gray-600">
        This is a client component that will be rendered on the client-side.
      </p>
      <div>{JSON.stringify(users, null, 2)}</div>
    </div>
  );
};
