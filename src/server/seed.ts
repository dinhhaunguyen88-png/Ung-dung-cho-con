import { supabase } from './supabaseClient.js';

const seedQuestions = async () => {
    console.log('🌱 Seeding questions to Supabase...');

    const mathQuestions = [
        // Addition
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
        // Multiplication
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
        // Division
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

    // Clear existing questions first (optional but recommended for clean seed)
    await supabase.from('questions').delete().neq('id', 0);

    const { error } = await supabase.from('questions').insert(mathQuestions);

    if (error) {
        console.error('❌ Error seeding questions:', error);
    } else {
        console.log('✅ Successfully seeded questions');
    }
};

seedQuestions();
