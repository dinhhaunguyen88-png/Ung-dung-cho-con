import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { supabase } from './supabaseClient.js';
import {
    communityQuestions,
    earthSkyQuestions,
    familyQuestions,
    healthQuestions,
    natureQuestions,
    schoolQuestions,
} from './seed_science_questions.js';
import { grammarQuestions, vocabQuestions } from './seed_english_questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadVietnameseQuestions() {
    const sourcePath = join(__dirname, '../../seed_data_v2.json');
    const raw = JSON.parse(readFileSync(sourcePath, 'utf8'));

    return raw.map((question: any) => {
        const correctIndex = question.choices.findIndex((choice: any) => choice.isCorrect);

        return {
            subject: 'vietnamese',
            topic: question.topic,
            difficulty: question.difficulty,
            content: {
                vi: {
                    questionText: question.content_vi,
                    questionReadText: question.content_vi,
                },
                en: {
                    questionText: question.content_en,
                    questionReadText: question.content_en,
                },
            },
            choices: question.choices.map((choice: any, index: number) => ({
                id: index + 1,
                value: choice.text,
                label: String.fromCharCode(65 + index),
            })),
            correct_answer_id: correctIndex + 1,
        };
    });
}

function loadMathQuestions() {
    const sourcePath = join(__dirname, '../../seed_math_200.json');
    return JSON.parse(readFileSync(sourcePath, 'utf8')).map((question: any) => ({
        ...question,
        subject: String(question.subject || 'math').toLowerCase(),
    }));
}

async function seedMaster() {
    const vietnameseQuestions = loadVietnameseQuestions();
    const mathQuestions = loadMathQuestions();
    const scienceQuestions = [
        ...familyQuestions,
        ...schoolQuestions,
        ...communityQuestions,
        ...natureQuestions,
        ...healthQuestions,
        ...earthSkyQuestions,
    ];
    const englishQuestions = [...vocabQuestions, ...grammarQuestions];

    const allQuestions = [
        ...mathQuestions,
        ...vietnameseQuestions,
        ...scienceQuestions,
        ...englishQuestions,
    ];

    console.log('Starting master seed...');
    console.log(`- Math: ${mathQuestions.length}`);
    console.log(`- Vietnamese: ${vietnameseQuestions.length}`);
    console.log(`- Science: ${scienceQuestions.length}`);
    console.log(`- English: ${englishQuestions.length}`);
    console.log(`- Total: ${allQuestions.length}`);

    const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .neq('subject', '__never__');

    if (deleteError) {
        console.error('Failed to clear existing questions:', deleteError);
        process.exit(1);
    }

    const chunkSize = 100;
    for (let index = 0; index < allQuestions.length; index += chunkSize) {
        const chunk = allQuestions.slice(index, index + chunkSize);
        const { error } = await supabase.from('questions').insert(chunk);

        if (error) {
            console.error(`Failed to insert chunk ${index / chunkSize + 1}:`, error);
            process.exit(1);
        }

        console.log(`Inserted chunk ${index / chunkSize + 1}`);
    }

    console.log('Master seed complete.');
}

seedMaster().catch((error) => {
    console.error('Fatal seed error:', error);
    process.exit(1);
});
