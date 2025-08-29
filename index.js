import 'dotenv/config';
import OpenAI from 'openai';
import { chromium } from 'playwright';
import { buildAgent } from './agent.js';

async function main() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY in .env');

  const client = new OpenAI({ apiKey: key });

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const agent =  buildAgent(client, { model: 'gpt-4.1-mini', browser, page });

  const goal = `Open https://ui.chaicode.com/, detect a login form, 
  fill the email and password fields (email=test@example.com, password=Password123!), 
  and submit the form. If no form or already logged in, say done.`;

  console.log('Running agent with goal:', goal);

  const result = await agent.run(goal);

  console.log('Agent finished. Result:', result);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
