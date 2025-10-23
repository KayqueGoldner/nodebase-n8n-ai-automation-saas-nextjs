import { LogoutButton } from "@/app/logout";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div>
      Protected route
      <div>
        {JSON.stringify(data, null, 2)}
      </div>

      <LogoutButton />
    </div>
  );
}
