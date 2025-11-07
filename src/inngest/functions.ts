import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

import { inngest } from "./client";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai", retries: 3 },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("wait-for-ai", "5s");

    const { steps: geminiSteps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant.",
      prompt: "Write a short story about a robot.",
    });
    const { steps: openaiSteps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-4o"),
      system: "You are a helpful assistant.",
      prompt: "Write a short story about a robot.",
    });
    const { steps: anthropicSteps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic("claude-sonnet-4-0"),
      system: "You are a helpful assistant.",
      prompt: "Write a short story about a robot.",
    });

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    }
  },
);