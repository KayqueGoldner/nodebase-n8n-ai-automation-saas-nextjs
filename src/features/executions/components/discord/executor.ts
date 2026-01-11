import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { decode } from "html-entities";
import ky from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { discordChannel } from "@/inngest/channels/discord";

Handlebars.registerHelper("json", (value: any) => {
  const jsonString = JSON.stringify(value, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

export type ModelIdType = Parameters<ReturnType<typeof createGoogleGenerativeAI>[ "languageModel" ]>[ 0 ];

type DiscordData = {
  variableName?: string;
  content?: string;
  webhookUrl?: string;
  username?: string;
}

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  context,
  nodeId,
  step,
  publish
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Discord node: message content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Discord node: variable name is required");
      }

      if (!data.webhookUrl) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Discord node: webhook URL is required");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000), // Discord has a limit of 2000 characters
          username,
        },
      });

      return {
        ...context,
        [ data.variableName ]: {
          messageContent: content.slice(0, 2000),
        },
      }
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
}
