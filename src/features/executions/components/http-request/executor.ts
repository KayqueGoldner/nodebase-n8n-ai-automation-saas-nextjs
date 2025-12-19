import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (value: any) => {
  const jsonString = JSON.stringify(value, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
}) => {
  // TODO: publish "loading" state for http request

  if (!data.endpoint) {
    // TODO: publish "error" state for http request

    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  if (!data.variableName) {
    // TODO: publish "error" state for http request

    throw new NonRetriableError("HTTP Request node: No variable name configured");
  }

  if (!data.method) {
    // TODO: publish "error" state for http request

    throw new NonRetriableError("HTTP Request node: No method configured");
  }

  const result = await step.run("http-request", async () => {
    const method = data.method;
    /**
     * Endpoint compiled with Handlebars using the provided context
     * 
     * @example
     * 
     * const endpoint = Handlebars.compile("https://.../{{userId}}")(context);
     * // endpoint = https://.../123
     */
    const endpoint = Handlebars.compile(data.endpoint)(context);

    const options: KyOptions = {
      method,
    }

    if ([ "POST", "PUT", "PATCH" ].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    }

    return {
      ...context,
      [ data.variableName ]: responsePayload,
    }
  });

  // TODO: publish "success" state for http request

  return result;
};