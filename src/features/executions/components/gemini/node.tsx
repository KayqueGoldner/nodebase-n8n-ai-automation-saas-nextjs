"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

import {
  AVAILABLE_MODELS,
  GeminiDialog,
  type GeminiDialogFormSchema
} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { ModelIdType } from "./executor";

type GeminiNodeData = {
  credentialId?: string;
  variableName?: string;
  model?: ModelIdType;
  systemPrompt?: string;
  userPrompt?: string;
}

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[ 0 ]}: ${nodeData.userPrompt.length > 50
      ? nodeData.userPrompt.substring(0, 50) + "..."
      : nodeData.userPrompt
    }`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const handleSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: GeminiDialogFormSchema) => {
    setNodes((nodes) => {
      return nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      });
    });
    setDialogOpen(false);
  };

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/gemini.svg"
        name="Gemini"
        status={nodeStatus}
        description={description}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  )
});

GeminiNode.displayName = "GeminiNode";
