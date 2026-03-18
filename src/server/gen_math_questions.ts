
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY is missing in .env');
  process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  label: string;
}

interface Question {
  topic: string;
  content_vi: string;
  content_en: string;
  difficulty: string;
  subject: string;
  choices: Choice[];
}

const TOPICS = [
  { name: 'Ôn tập và bổ sung', count: 30 },
  { name: 'Phép cộng, phép trừ qua 10 trong phạm vi 20', count: 40 },
  { name: 'Phép cộng, phép trừ có nhớ trong phạm vi 100', count: 40 },
  { name: 'Làm quen với hình khối, hình học cơ bản', count: 30 },
  { name: 'Phép nhân, phép chia (bảng 2 và 5)', count: 30 },
  { name: 'Số có ba chữ số, Phép cộng, trừ trong phạm vi 1000', count: 30 }
];

async function generateChunk(topic: string, count: number, retryCount = 0): Promise<Question[]> {
  const prompt = `
    Generate ${count} math questions for Grade 2 (Lớp 2) in Vietnamese following the "Chân trời sáng tạo" curriculum.
    Topic: ${topic}
    
    Format each question as a JSON object with these fields:
    - topic: "${topic}"
    - content_vi: Question text in Vietnamese
    - content_en: English translation of content_vi
    - difficulty: "easy", "medium", or "hard"
    - subject: "math"
    - choices: An array of 4 objects, each with { id: "a", "b", "c", or "d", text: "string", isCorrect: boolean, label: "A", "B", "C", or "D" }
    
    Ensure:
    1. Only ONE choice is marked as isCorrect: true.
    2. Mathematical correctness.
    3. Diverse question types (calculation, word problems, geometry, logic).
    4. Language is friendly for 7-8 year olds.
    5. Return ONLY a valid JSON array.
  `;

  try {
    const result = await (client.models as any).generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    const candidates = result.candidates || (result.response && result.response.candidates);
    if (!candidates || candidates.length === 0) {
      throw new Error('Empty candidates');
    }
    
    const responseText = candidates[0].content.parts[0].text;
    const jsonStr = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error: any) {
    if (retryCount < 3) {
      const waitTime = error.message?.includes('429') ? 30000 : 10000;
      console.warn(`  Warning: Request failed for ${topic}. Error: ${error.message || error}. Retrying in ${waitTime/1000}s... (Attempt ${retryCount + 1})`);
      await new Promise(r => setTimeout(r, waitTime));
      return generateChunk(topic, count, retryCount + 1);
    }
    console.error(`Error generating chunk for ${topic}:`, error);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting consolidated math question generation...');
  let allQuestions: Question[] = [];
  
  for (const topic of TOPICS) {
    console.log(`Generating ${topic.count} questions for: ${topic.name}...`);
    const questionsPerRequest = 20; // High count to minimize requests
    const iterations = Math.ceil(topic.count / questionsPerRequest);
    
    for (let i = 0; i < iterations; i++) {
        const remaining = topic.count - (i * questionsPerRequest);
        const currentCount = Math.min(questionsPerRequest, remaining);
        console.log(`  Chunk ${i+1}/${iterations} (${currentCount} questions)`);
        
        const chunk = await generateChunk(topic.name, currentCount);
        allQuestions = allQuestions.concat(chunk);
        
        // Moderate delay between requests (15 seconds)
        await new Promise(r => setTimeout(r, 15000));
    }
  }

  const outputPath = 'd:/ung dung/Dinh-Hau-Nguyen/src/server/math_questions_v4.json';
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log(`✅ Successfully generated ${allQuestions.length} questions to ${outputPath}`);
}

main().catch(console.error);
