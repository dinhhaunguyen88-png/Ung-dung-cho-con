import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://adkoreafiamvnxamftva.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka29yZWFmaWFtdm54YW1mdHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTYyODQsImV4cCI6MjA4Nzc3MjI4NH0.HhgKe60miUzXumLHaSJqkI7hsA1CGwWNZ5PWql6ArwM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
    console.log('Reading seed_data_v2.json...');
    const rawData = fs.readFileSync('d:/ung dung/Dinh-Hau-Nguyen/seed_data_v2.json', 'utf8');
    const questions = JSON.parse(rawData);

    console.log(`Starting to seed ${questions.length} questions...`);

    // Clear existing questions to avoid duplicates and ensure a fresh start
    const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
        console.error('Error clearing questions:', deleteError);
        return;
    }

    const { data, error } = await supabase
        .from('questions')
        .insert(questions);

    if (error) {
        console.error('Error seeding questions:', error);
    } else {
        console.log('Successfully seeded all 85 questions!');
    }
}

seed();
