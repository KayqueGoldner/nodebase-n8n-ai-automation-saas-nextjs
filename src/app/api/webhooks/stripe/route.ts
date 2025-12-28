import { type NextRequest, NextResponse } from "next/server";

import { sendWorkflowExecution } from "@/inngest/utils";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json({ success: false, error: "Missing workflowId" }, { status: 400 });
    }

    const body = await request.json();

    const stripeData = {
      // event metadata
      eventId: body.id,
      eventType: body.type,
      eventTimestamp: body.created,
      eventLivemode: body.livemode,
      raw: body.data?.object,
    }

    // trigger an inngest job
    await sendWorkflowExecution({
      workflowId: workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe Webhook error: ", error);
    return NextResponse.json({ success: false, error: "Failed to process Stripe event" }, { status: 500 });
  }
}
