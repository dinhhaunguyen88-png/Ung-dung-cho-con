
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const client = new GoogleGenAI({ apiKey });

async function main() {
  const models = await (client.models as any).list();
  console.log(JSON.stringify(models, null, 2));
}
main().catch(console.error);
