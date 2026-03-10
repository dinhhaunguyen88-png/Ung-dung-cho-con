import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'mathbuddy.db');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

console.log('🔌 Connecting to database:', DB_PATH);

// Create tables
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT 'dragon',
      avatar_color TEXT DEFAULT '#30e86e',
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      subject TEXT DEFAULT 'math',
      topic TEXT,
      correct INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE REFERENCES users(id),
      type TEXT DEFAULT 'dragon',
      name TEXT DEFAULT 'Sparky',
      color TEXT DEFAULT '#30e86e',
      accessories TEXT DEFAULT '["party-hat"]',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT DEFAULT 'math',
      topic TEXT,
      difficulty TEXT DEFAULT 'easy',
      content TEXT NOT NULL, -- JSON: { questionText, questionReadText }
      choices TEXT NOT NULL, -- JSON: [ { id, value, label } ]
      correct_answer_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Database schema verified');
} catch (err) {
  console.error('❌ Database schema error:', err);
  throw err;
}

// Seed mock students for leaderboard (only if empty)
try {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (userCount.c === 0) {
    const insertUser = db.prepare('INSERT INTO users (name, avatar, avatar_color, xp, level) VALUES (?, ?, ?, ?, ?)');
    const insertPet = db.prepare('INSERT INTO pets (user_id, type, name, color, accessories, level, xp) VALUES (?, ?, ?, ?, ?, ?, ?)');

    const seeds = [
      { name: 'Minh Anh', avatar: 'cat', color: '#ec4899', xp: 2450, level: 13, petName: 'Luna' },
      { name: 'Bảo', avatar: 'dragon', color: '#30e86e', xp: 2100, level: 11, petName: 'Rồng Con' },
      { name: 'Hà My', avatar: 'bunny', color: '#8b5cf6', xp: 1800, level: 10, petName: 'Bông' },
      { name: 'Đức', avatar: 'dog', color: '#3b82f6', xp: 1500, level: 8, petName: 'Buddy' },
      { name: 'Linh', avatar: 'cat', color: '#f97316', xp: 1200, level: 7, petName: 'Mimi' },
      { name: 'Khoa', avatar: 'dragon', color: '#ef4444', xp: 950, level: 5, petName: 'Lửa' },
      { name: 'Thảo', avatar: 'bunny', color: '#06b6d4', xp: 700, level: 4, petName: 'Bi' },
      { name: 'Nam', avatar: 'dog', color: '#eab308', xp: 400, level: 3, petName: 'Rex' },
    ];

    const insertMany = db.transaction(() => {
      for (const s of seeds) {
        const result = insertUser.run(s.name, s.avatar, s.color, s.xp, s.level);
        insertPet.run(result.lastInsertRowid, s.avatar, s.petName, s.color, '["party-hat"]', s.level, s.xp);
      }
    });
    insertMany();
    console.log('✅ Seeded 8 mock students');
  }
} catch (err) {
  console.error('❌ User seeding error:', err);
}

// Seed questions (only if empty)
try {
  const questionCount = db.prepare('SELECT COUNT(*) as c FROM questions').get() as { c: number };
  if (questionCount.c === 0) {
    const insertQuestion = db.prepare(`
            INSERT INTO questions (subject, topic, difficulty, content, choices, correct_answer_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);

    const mathQuestions = [
      {
        topic: 'addition',
        difficulty: 'easy',
        content: { questionText: '12 + 5 = ?', questionReadText: 'Mười hai cộng năm bằng bao nhiêu?' },
        choices: [
          { id: 1, value: 15, label: 'A' },
          { id: 2, value: 17, label: 'B' },
          { id: 3, value: 19, label: 'C' },
          { id: 4, value: 20, label: 'D' }
        ],
        correct_answer_id: 2
      },
      {
        topic: 'addition',
        difficulty: 'easy',
        content: { questionText: '8 + 8 = ?', questionReadText: 'Tám cộng tám bằng bao nhiêu?' },
        choices: [
          { id: 1, value: 14, label: 'A' },
          { id: 2, value: 16, label: 'B' },
          { id: 3, value: 18, label: 'C' },
          { id: 4, value: 12, label: 'D' }
        ],
        correct_answer_id: 2
      },
      {
        topic: 'subtraction',
        difficulty: 'easy',
        content: { questionText: '20 - 7 = ?', questionReadText: 'Hai mươi trừ bảy bằng bao nhiêu?' },
        choices: [
          { id: 1, value: 13, label: 'A' },
          { id: 2, value: 11, label: 'B' },
          { id: 3, value: 15, label: 'C' },
          { id: 4, value: 10, label: 'D' }
        ],
        correct_answer_id: 1
      }
    ];

    const insertAll = db.transaction(() => {
      for (const q of mathQuestions) {
        insertQuestion.run(
          'math',
          q.topic,
          q.difficulty,
          JSON.stringify(q.content),
          JSON.stringify(q.choices),
          q.correct_answer_id
        );
      }
    });
    insertAll();
    console.log('✅ Seeded initial math questions');
  }
} catch (err) {
  console.error('❌ Question seeding error:', err);
}

export default db;
