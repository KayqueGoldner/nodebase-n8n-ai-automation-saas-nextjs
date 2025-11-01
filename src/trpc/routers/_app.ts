import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure
    .mutation(async () => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: "test@example.com",
        },
      })

      return { success: true, message: "job queued" }
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
