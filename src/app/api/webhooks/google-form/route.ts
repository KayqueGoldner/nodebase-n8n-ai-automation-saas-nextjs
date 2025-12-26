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

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      responses: body.responses,
      respondentEmail: body.respondentEmail,
      raw: body
    }

    // trigger an inngest job
    await sendWorkflowExecution({
      workflowId: workflowId,
      initialData: {
        googleForm: formData,
      },
    });


  } catch (error) {
    console.error("Google Form Webhook error: ", error);
    return NextResponse.json({ success: false, error: "Failed to process Google Form submission" }, { status: 500 });
  }
}
