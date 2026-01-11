"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

import {
  DiscordDialog,
  type DiscordDialogFormSchema
} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.length > 50
      ? nodeData.content.substring(0, 50) + "..."
      : nodeData.content
    }`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const handleSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: DiscordDialogFormSchema) => {
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
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/discord.svg"
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  )
});

DiscordNode.displayName = "DiscordNode";
