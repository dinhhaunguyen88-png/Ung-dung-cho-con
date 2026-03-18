import { supabase } from './supabaseClient.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
    familyQuestions,
    schoolQuestions,
    communityQuestions,
    natureQuestions,
    healthQuestions,
    earthSkyQuestions
} from './seed_science_questions.js';

import {
    vocabQuestions,
    grammarQuestions
} from './seed_english_questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedAll() {
    console.log('🚀 Starting Master Seed v4...');

    // 1. Load Vietnamese Questions from JSON
    console.log('📖 Loading Vietnamese questions from seed_data_v2.json...');
    const vntPath = join(__dirname, '../../seed_data_v2.json');
    const vntRaw = JSON.parse(readFileSync(vntPath, 'utf-8'));
    
    const vntQuestions = vntRaw.map((q: any) => {
        const correctIndex = q.choices.findIndex((c: any) => c.isCorrect);
        return {
            subject: 'vietnamese',
            topic: q.topic,
            difficulty: q.difficulty,
            content: {
                vi: { questionText: q.content_vi, questionReadText: q.content_vi },
                en: { questionText: q.content_en, questionReadText: q.content_en }
            },
            choices: q.choices.map((c: any, i: number) => ({
                id: i + 1,
                value: c.text,
                label: String.fromCharCode(65 + i)
            })),
            correct_answer_id: correctIndex + 1
        };
    });

    // 2. Combine all Science & English questions
    const sciQuestions = [
        ...familyQuestions,
        ...schoolQuestions,
        ...communityQuestions,
        ...natureQuestions,
        ...healthQuestions,
        ...earthSkyQuestions
    ];

    const engQuestions = [
        ...vocabQuestions,
        ...grammarQuestions
    ];

    const mathQuestions = [
        {
            subject: 'math',
            topic: 'addition',
            difficulty: 'easy',
            content: {
                vi: { questionText: '12 + 5 = ?', questionReadText: 'Mười hai cộng năm bằng bao nhiêu?' },
                en: { questionText: '12 + 5 = ?', questionReadText: 'What is twelve plus five?' }
            },
            choices: [
                { id: 1, value: 15, label: 'A' },
                { id: 2, value: 17, label: 'B' },
                { id: 3, value: 19, label: 'C' },
                { id: 4, value: 20, label: 'D' }
            ],
            correct_answer_id: 2
        },
        {
            subject: 'math',
            topic: 'multiplication',
            difficulty: 'easy',
            content: {
                vi: { questionText: '2 x 3 = ?', questionReadText: 'Hai nhân ba bằng bao nhiêu?' },
                en: { questionText: '2 x 3 = ?', questionReadText: 'What is two times three?' }
            },
            choices: [
                { id: 1, value: 5, label: 'A' },
                { id: 2, value: 6, label: 'B' },
                { id: 3, value: 7, label: 'C' },
                { id: 4, value: 8, label: 'D' }
            ],
            correct_answer_id: 2
        },
        {
            subject: 'math',
            topic: 'multiplication',
            difficulty: 'easy',
            content: {
                vi: { questionText: '5 x 4 = ?', questionReadText: 'Năm nhân bốn bằng bao nhiêu?' },
                en: { questionText: '5 x 4 = ?', questionReadText: 'What is five times four?' }
            },
            choices: [
                { id: 1, value: 15, label: 'A' },
                { id: 2, value: 18, label: 'B' },
                { id: 3, value: 20, label: 'C' },
                { id: 4, value: 25, label: 'D' }
            ],
            correct_answer_id: 3
        },
        {
            subject: 'math',
            topic: 'division',
            difficulty: 'easy',
            content: {
                vi: { questionText: '10 : 2 = ?', questionReadText: 'Mười chia hai bằng bao nhiêu?' },
                en: { questionText: '10 / 2 = ?', questionReadText: 'What is ten divided by two?' }
            },
            choices: [
                { id: 1, value: 3, label: 'A' },
                { id: 2, value: 4, label: 'B' },
                { id: 3, value: 5, label: 'C' },
                { id: 4, value: 6, label: 'D' }
            ],
            correct_answer_id: 3
        },
        {
            subject: 'math',
            topic: 'division',
            difficulty: 'easy',
            content: {
                vi: { questionText: '12 : 3 = ?', questionReadText: 'Mười hai chia ba bằng bao nhiêu?' },
                en: { questionText: '12 / 3 = ?', questionReadText: 'What is twelve divided by three?' }
            },
            choices: [
                { id: 1, value: 2, label: 'A' },
                { id: 2, value: 4, label: 'B' },
                { id: 3, value: 5, label: 'C' },
                { id: 4, value: 6, label: 'D' }
            ],
            correct_answer_id: 2
        }
    ];

    const allQuestions = [...vntQuestions, ...sciQuestions, ...engQuestions, ...mathQuestions];

    console.log(`📊 Totals:
    - Math:       ${mathQuestions.length}
    - Vietnamese: ${vntQuestions.length}
    - Science:    ${sciQuestions.length}
    - English:    ${engQuestions.length}
    ---------------------------
    - Total:      ${allQuestions.length}`);

    // 3. Clear existing questions (Optional but recommended for full reset)
    console.log('🧹 Clearing existing questions...');
    const { error: deleteError } = await supabase.from('questions').delete().neq('id', 0);
    if (deleteError) {
        console.error('❌ Error clearing questions:', deleteError);
        // continue anyway
    }

    // 4. Batch Insert
    console.log('📤 Inserting all questions into Supabase...');
    // Supabase insert has limits on batch size, but 300 should be fine.
    // If it fails, we can chunk it.
    const CHUNK_SIZE = 100;
    for (let i = 0; i < allQuestions.length; i += CHUNK_SIZE) {
        const chunk = allQuestions.slice(i, i + CHUNK_SIZE);
        const { error: insertError } = await supabase.from('questions').insert(chunk);
        if (insertError) {
            console.error(`❌ Error inserting chunk ${i / CHUNK_SIZE + 1}:`, insertError);
            process.exit(1);
        }
        console.log(`✅ Inserted chunk ${i / CHUNK_SIZE + 1}`);
    }

    console.log('🎉 Seed v4 complete!');
}

seedAll().catch(err => {
    console.error('💥 Fatal error during seeding:', err);
    process.exit(1);
});
