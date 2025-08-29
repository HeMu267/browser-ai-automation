import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import { navigateTool, fillTool, clickTool, domSummaryTool, screenshotTool } from "./tools.js";

export function buildAgent(client, opts) {
  const { model = "gpt-4.1-mini", browser, page } = opts;

  setDefaultOpenAIClient(client);

  const internalAgent = new Agent({
    name: "browser-ai",
    model,
    tools: [navigateTool, fillTool, clickTool, domSummaryTool, screenshotTool],
    instructions: `You are a web automation agent. Use the minimal safe actions to accomplish goals. 
    Prefer domSummary for structure; use screenshot only if necessary. 
    When filling a form use input selectors if available.`,
    state: {
      browser,
      page
    }
  });

  return {
    run: async (input) => {
      const result = await run(internalAgent, input,{
        context:{browser,page}
      });
      return result.finalOutput;
    }
  };
}