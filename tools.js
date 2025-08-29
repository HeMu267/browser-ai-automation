import { tool } from "@openai/agents";
import { z } from "zod";

// navigate tool
export const navigateTool = tool({
  name: "navigate",
  description: "Navigate the browser to a URL (returns simple confirmation).",
  parameters: z.object({
    url: z.string().describe("The URL to navigate to")
  }),
  async execute({ url }, context) {
    // console.log("url to be searched is ",url);
    // console.log("context is ",context);
    console.log(
        "loading page..."
    )
    const { page } = context.context;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    return { ok: true, url: page.url(), title: await page.title() };
  }
});

// fill tool
export const fillTool = tool({
  name: "fill",
  description: "Fill an input field identified by a CSS selector with text.",
  parameters: z.object({
    selector: z.string().describe("CSS selector of the input field"),
    value: z.string().describe("Text value to fill into the field")
  }),
  async execute({ selector, value }, context) {
    const { page } = context.context;
    await page.waitForSelector(selector, { timeout: 3000 });
    await page.fill(selector, value);
    return `Filled ${selector}`;
  }
});

// click tool
export const clickTool = tool({
  name: "click",
  description: "Click an element specified by a CSS selector.",
  parameters: z.object({
    selector: z.string().describe("CSS selector of the element to click")
  }),
  async execute({ selector }, context) {
    const { page } = context.context;
    await page.waitForSelector(selector, { timeout: 3000 });
    await page.click(selector);
    return `Clicked ${selector}`;
  }
});

// domSummary tool
export const domSummaryTool = tool({
  name: "domSummary",
  description: "Return a filtered summary of visible inputs/buttons/links (keeps payload small).",
  parameters: z.object({}), 
  async execute(_params, context) {
    const { page } = context.context;
    const summary = await page.evaluate(() => {
      const nodes = [];
      function textish(el) {
        return (el.textContent || el.placeholder || "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 120);
      }
      const selector = ["input", "textarea", "button", "a", "select"].join(",");
      document.querySelectorAll(selector).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        const style = window.getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") return;
        nodes.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          name: el.name || null,
          type: el.type || null,
          text: textish(el),
          placeholder: el.placeholder || null
        });
      });
      return nodes.slice(0, 200);
    });
    return summary;
  }
});

// screenshot tool
export const screenshotTool = tool({
  name: "screenshot",
  description: "Take a full-page screenshot and return it as base64 (expensive).",
  parameters: z.object({}), // no params needed
  async execute(_params, context) {
    const { page } = context.context;
    const buf = await page.screenshot({ fullPage: true });
    return buf.toString("base64");
  }
});
