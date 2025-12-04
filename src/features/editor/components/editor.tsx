"use client";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { ErrorView, LoadingView } from "@/components/entity-components";

interface EditorProps {
  workflowId: string;
}

export const Editor = ({ workflowId }: EditorProps) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  return (
    <div>
      <p>
        {JSON.stringify(workflow, null, 2)}
      </p>
    </div>
  )
}

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />
}

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />
}
