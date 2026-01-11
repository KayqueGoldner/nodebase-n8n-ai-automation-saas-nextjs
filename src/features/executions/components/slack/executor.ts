import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { decode } from "html-entities";
import ky from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (value: any) => {
  const jsonString = JSON.stringify(value, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

export type ModelIdType = Parameters<ReturnType<typeof createGoogleGenerativeAI>[ "languageModel" ]>[ 0 ];

type SlackData = {
  variableName?: string;
  content?: string;
  webhookUrl?: string;
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  context,
  nodeId,
  step,
  publish
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Slack node: message content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.variableName) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Slack node: variable name is required");
      }

      if (!data.webhookUrl) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Slack node: webhook URL is required");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content, // the key depends on workflow config
        },
      });

      return {
        ...context,
        [ data.variableName ]: {
          messageContent: content,
        },
      }
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
}
