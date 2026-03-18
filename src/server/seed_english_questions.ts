import { supabase } from './supabaseClient.js';

// Helper to build a question object
export function q(topic: string, diff: string, vi: string, en: string, choices: string[], correct: number) {
    return {
        subject: 'english',
        topic,
        difficulty: diff,
        content: {
            vi: { questionText: vi, questionReadText: vi },
            en: { questionText: en, questionReadText: en },
        },
        choices: choices.map((v, i) => ({ id: i + 1, value: v, label: String.fromCharCode(65 + i) })),
        correct_answer_id: correct,
    };
}

export const vocabQuestions = [
    // ── Animals (10) ──
    q('Animals', 'easy', 'Con vật nào kêu "meow"?', 'Which animal says "meow"?', ['Cat', 'Dog', 'Cow', 'Duck'], 1),
    q('Animals', 'easy', '"Dog" nghĩa là gì?', 'What does "dog" mean?', ['Con chó', 'Con mèo', 'Con gà', 'Con vịt'], 1),
    q('Animals', 'easy', 'Con vật nào sống dưới nước?', 'Which animal lives in water?', ['Fish', 'Bird', 'Cat', 'Dog'], 1),
    q('Animals', 'easy', '"Rabbit" là con gì?', 'What animal is a "rabbit"?', ['Con thỏ', 'Con rắn', 'Con ếch', 'Con kiến'], 1),
    q('Animals', 'medium', 'Điền vào chỗ trống: The ___ has wings and can fly.', 'Fill in the blank: The ___ has wings and can fly.', ['bird', 'fish', 'dog', 'cat'], 1),
    q('Animals', 'easy', '"Elephant" là con gì?', 'What animal is an "elephant"?', ['Con voi', 'Con hổ', 'Con sư tử', 'Con gấu'], 1),
    q('Animals', 'medium', 'Con vật nào là "monkey"?', 'Which animal is a "monkey"?', ['Con khỉ', 'Con cáo', 'Con sóc', 'Con thỏ'], 1),
    q('Animals', 'easy', '"Duck" nghĩa là gì?', 'What does "duck" mean?', ['Con vịt', 'Con gà', 'Con ngỗng', 'Con cú'], 1),
    q('Animals', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['The cat is small.', 'The cat is big like an elephant.', 'The cat can fly.', 'The cat lives in water.'], 1),
    q('Animals', 'hard', 'Sắp xếp: "a / I / have / pet / dog"', 'Arrange: "a / I / have / pet / dog"', ['I have a pet dog.', 'A dog I pet have.', 'Have I a pet dog.', 'Pet dog I have a.'], 1),

    // ── Colors (10) ──
    q('Colors', 'easy', 'Bầu trời có màu gì? (tiếng Anh)', 'What color is the sky?', ['Blue', 'Red', 'Green', 'Yellow'], 1),
    q('Colors', 'easy', '"Red" là màu gì?', 'What color is "red"?', ['Đỏ', 'Xanh', 'Vàng', 'Trắng'], 1),
    q('Colors', 'easy', 'Lá cây có màu gì? (tiếng Anh)', 'What color are leaves?', ['Green', 'Blue', 'Red', 'White'], 1),
    q('Colors', 'easy', '"Yellow" nghĩa là gì?', 'What does "yellow" mean?', ['Vàng', 'Cam', 'Tím', 'Nâu'], 1),
    q('Colors', 'medium', 'Điền vào chỗ trống: The sun is ___.', 'Fill in: The sun is ___.', ['yellow', 'blue', 'green', 'black'], 1),
    q('Colors', 'easy', 'Sữa có màu gì? (tiếng Anh)', 'What color is milk?', ['White', 'Brown', 'Pink', 'Red'], 1),
    q('Colors', 'medium', '"Orange" vừa có nghĩa là màu cam, vừa là gì?', '"Orange" means a color and also a...?', ['fruit', 'vegetable', 'flower', 'animal'], 1),
    q('Colors', 'easy', 'Ban đêm, bầu trời màu gì?', 'What color is the night sky?', ['Black', 'White', 'Green', 'Red'], 1),
    q('Colors', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['My bag is pink.', 'My bag is swim.', 'My bag is run.', 'My bag is eat.'], 1),
    q('Colors', 'hard', 'Trộn "red" và "yellow" thành màu gì?', 'Mix "red" and "yellow" to get what color?', ['Orange', 'Green', 'Purple', 'Brown'], 1),

    // ── Numbers (10) ──
    q('Numbers', 'easy', 'Số 1 tiếng Anh là gì?', 'What is number 1 in English?', ['One', 'Two', 'Three', 'Four'], 1),
    q('Numbers', 'easy', '"Five" là số mấy?', 'What number is "five"?', ['5', '4', '6', '3'], 1),
    q('Numbers', 'easy', 'Số 10 tiếng Anh là gì?', 'What is number 10 in English?', ['Ten', 'Twelve', 'Twenty', 'Eleven'], 1),
    q('Numbers', 'medium', 'Three + four = ?', 'Three + four = ?', ['Seven', 'Six', 'Eight', 'Five'], 1),
    q('Numbers', 'easy', '"Eight" là số mấy?', 'What number is "eight"?', ['8', '6', '9', '7'], 1),
    q('Numbers', 'medium', 'Điền vào: I have ___ fingers on one hand.', 'Fill in: I have ___ fingers on one hand.', ['five', 'four', 'six', 'three'], 1),
    q('Numbers', 'easy', 'Số 0 tiếng Anh là gì?', 'What is 0 in English?', ['Zero', 'One', 'None', 'Null'], 1),
    q('Numbers', 'medium', 'Chọn số lớn nhất:', 'Choose the biggest number:', ['Twenty', 'Twelve', 'Ten', 'Fifteen'], 1),
    q('Numbers', 'hard', 'Đếm: one, two, three, ___, five', 'Count: one, two, three, ___, five', ['four', 'six', 'seven', 'eight'], 1),
    q('Numbers', 'medium', '"Eleven" là số mấy?', 'What number is "eleven"?', ['11', '12', '10', '13'], 1),

    // ── Family (10) ──
    q('Family', 'easy', '"Mother" nghĩa là gì?', 'What does "mother" mean?', ['Mẹ', 'Bố', 'Chị', 'Bà'], 1),
    q('Family', 'easy', 'Bố tiếng Anh là gì?', 'What is "father" in Vietnamese?', ['Bố', 'Mẹ', 'Anh', 'Ông'], 1),
    q('Family', 'easy', '"Sister" là ai trong gia đình?', 'Who is a "sister" in the family?', ['Chị/em gái', 'Anh trai', 'Mẹ', 'Bà'], 1),
    q('Family', 'medium', 'Điền vào: My ___ cooks dinner for us.', 'Fill in: My ___ cooks dinner for us.', ['mother', 'pencil', 'school', 'book'], 1),
    q('Family', 'easy', '"Brother" là ai?', 'Who is a "brother"?', ['Anh/em trai', 'Chị gái', 'Bố', 'Ông'], 1),
    q('Family', 'medium', '"Grandmother" và "grandfather" gọi chung là gì?', '"Grandmother" and "grandfather" together are called...?', ['grandparents', 'parents', 'children', 'siblings'], 1),
    q('Family', 'easy', '"Baby" nghĩa là gì?', 'What does "baby" mean?', ['Em bé', 'Người lớn', 'Ông', 'Cô'], 1),
    q('Family', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['I love my family.', 'I love my pencil family.', 'Family my I love.', 'My family book.'], 1),
    q('Family', 'hard', 'Bố của bố em gọi là gì? (tiếng Anh)', 'What do you call your father\'s father in English?', ['Grandfather', 'Uncle', 'Brother', 'Father'], 1),
    q('Family', 'medium', '"Uncle" là ai?', 'Who is an "uncle"?', ['Chú/bác/cậu', 'Bố', 'Anh trai', 'Ông'], 1),

    // ── School (10) ──
    q('School', 'easy', '"Teacher" nghĩa là gì?', 'What does "teacher" mean?', ['Giáo viên', 'Học sinh', 'Bác sĩ', 'Cảnh sát'], 1),
    q('School', 'easy', 'Bút chì tiếng Anh là gì?', 'What is "pencil" in English?', ['Pencil', 'Pen', 'Ruler', 'Eraser'], 1),
    q('School', 'easy', '"Book" là gì?', 'What is a "book"?', ['Quyển sách', 'Cái bàn', 'Cái ghế', 'Cái cặp'], 1),
    q('School', 'medium', 'Điền vào: I go to ___ every day.', 'Fill in: I go to ___ every day.', ['school', 'swim', 'sleep', 'sing'], 1),
    q('School', 'easy', '"Ruler" là gì?', 'What is a "ruler"?', ['Thước kẻ', 'Bút', 'Tẩy', 'Kéo'], 1),
    q('School', 'medium', 'Chọn đồ dùng học tập:', 'Choose a school supply:', ['Eraser', 'Banana', 'Cat', 'Car'], 1),
    q('School', 'easy', '"Classroom" nghĩa là gì?', 'What does "classroom" mean?', ['Phòng học', 'Phòng ngủ', 'Nhà bếp', 'Sân chơi'], 1),
    q('School', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['I read a book.', 'I read a chair.', 'I read a table.', 'I read a window.'], 1),
    q('School', 'hard', '"Homework" nghĩa là gì?', 'What does "homework" mean?', ['Bài tập về nhà', 'Bài hát', 'Trò chơi', 'Bài kiểm tra'], 1),
    q('School', 'medium', 'Bạn cùng lớp tiếng Anh là gì?', 'What is "classmate" in English?', ['Classmate', 'Teacher', 'Student', 'Friend'], 1),
];

export const grammarQuestions = [
    // ── This/That (10) ──
    q('This/That', 'easy', 'Điền vào: ___ is a cat. (gần)', 'Fill in: ___ is a cat. (near)', ['This', 'That', 'Those', 'These'], 1),
    q('This/That', 'easy', 'Điền vào: ___ is a bird. (xa)', 'Fill in: ___ is a bird. (far)', ['That', 'This', 'These', 'Those'], 1),
    q('This/That', 'medium', '"This" dùng khi nào?', 'When do we use "this"?', ['Khi vật ở gần', 'Khi vật ở xa', 'Khi có nhiều vật', 'Khi hỏi ai đó'], 1),
    q('This/That', 'easy', 'Chọn câu đúng:', 'Choose the correct sentence:', ['This is my pen.', 'This are my pen.', 'This am my pen.', 'This is my pens.'], 1),
    q('This/That', 'medium', '"That" dùng khi nào?', 'When do we use "that"?', ['Khi vật ở xa', 'Khi vật ở gần', 'Khi có nhiều vật', 'Khi nói về mình'], 1),
    q('This/That', 'medium', 'Điền vào: ___ is my school over there.', 'Fill in: ___ is my school over there.', ['That', 'This', 'These', 'Those'], 1),
    q('This/That', 'easy', 'Chọn câu đúng:', 'Choose the correct sentence:', ['That is a dog.', 'That are a dog.', 'That am a dog.', 'That is a dogs.'], 1),
    q('This/That', 'hard', '"These" là dạng số nhiều của từ nào?', '"These" is the plural of which word?', ['This', 'That', 'It', 'Those'], 1),
    q('This/That', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['These are books.', 'These is books.', 'These am books.', 'This are books.'], 1),
    q('This/That', 'hard', '"Those" là dạng số nhiều của từ nào?', '"Those" is the plural of which word?', ['That', 'This', 'These', 'It'], 1),

    // ── Verb to be (10) ──
    q('Verb to be', 'easy', 'Điền vào: I ___ a student.', 'Fill in: I ___ a student.', ['am', 'is', 'are', 'be'], 1),
    q('Verb to be', 'easy', 'Điền vào: She ___ tall.', 'Fill in: She ___ tall.', ['is', 'am', 'are', 'be'], 1),
    q('Verb to be', 'easy', 'Điền vào: They ___ happy.', 'Fill in: They ___ happy.', ['are', 'is', 'am', 'be'], 1),
    q('Verb to be', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['He is a boy.', 'He am a boy.', 'He are a boy.', 'He be a boy.'], 1),
    q('Verb to be', 'medium', 'Điền vào: We ___ friends.', 'Fill in: We ___ friends.', ['are', 'is', 'am', 'be'], 1),
    q('Verb to be', 'easy', '"Is" dùng với chủ ngữ nào?', 'Which subject uses "is"?', ['He/She/It', 'I', 'We/They', 'You'], 1),
    q('Verb to be', 'medium', 'Điền vào: It ___ a cat.', 'Fill in: It ___ a cat.', ['is', 'am', 'are', 'be'], 1),
    q('Verb to be', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['You are nice.', 'You is nice.', 'You am nice.', 'You be nice.'], 1),
    q('Verb to be', 'hard', 'Dạng phủ định của "I am" là gì?', 'What is the negative of "I am"?', ['I am not', 'I is not', 'I are not', 'I not am'], 1),
    q('Verb to be', 'hard', 'Viết tắt "She is" thành gì?', 'What is the contraction of "She is"?', ["She's", "She're", "She'm", "Shes"], 1),

    // ── Simple present (10) ──
    q('Simple present', 'easy', 'Điền vào: I ___ to school.', 'Fill in: I ___ to school.', ['go', 'goes', 'going', 'gone'], 1),
    q('Simple present', 'easy', 'Điền vào: She ___ milk.', 'Fill in: She ___ milk.', ['drinks', 'drink', 'drinking', 'drank'], 1),
    q('Simple present', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['He plays soccer.', 'He play soccer.', 'He playing soccer.', 'He played soccer.'], 1),
    q('Simple present', 'medium', 'Điền vào: We ___ English.', 'Fill in: We ___ English.', ['study', 'studies', 'studying', 'studied'], 1),
    q('Simple present', 'easy', 'Điền vào: The dog ___ fast.', 'Fill in: The dog ___ fast.', ['runs', 'run', 'running', 'ran'], 1),
    q('Simple present', 'medium', 'Khi nào thêm "s" vào động từ?', 'When do we add "s" to a verb?', ['Với He/She/It', 'Với I', 'Với We', 'Với They'], 1),
    q('Simple present', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['They eat rice.', 'They eats rice.', 'They eating rice.', 'They is eat rice.'], 1),
    q('Simple present', 'hard', 'Điền vào: My mom ___ breakfast every morning.', 'Fill in: My mom ___ breakfast every morning.', ['makes', 'make', 'making', 'made'], 1),
    q('Simple present', 'medium', 'Điền vào: I ___ my teeth every day.', 'Fill in: I ___ my teeth every day.', ['brush', 'brushes', 'brushing', 'brushed'], 1),
    q('Simple present', 'hard', 'Dạng phủ định: She ___ like spiders.', 'Negative form: She ___ like spiders.', ["doesn't", "don't", "isn't", "aren't"], 1),

    // ── Prepositions (10) ──
    q('Prepositions', 'easy', 'Con mèo ở ___ bàn. (trên)', 'The cat is ___ the table. (on top)', ['on', 'in', 'under', 'behind'], 1),
    q('Prepositions', 'easy', 'Quả bóng ở ___ hộp. (trong)', 'The ball is ___ the box. (inside)', ['in', 'on', 'under', 'next to'], 1),
    q('Prepositions', 'easy', 'Con chó ở ___ bàn. (dưới)', 'The dog is ___ the table. (below)', ['under', 'on', 'in', 'behind'], 1),
    q('Prepositions', 'medium', 'Điền vào: The book is ___ the bag.', 'Fill in: The book is ___ the bag.', ['in', 'at', 'up', 'off'], 1),
    q('Prepositions', 'medium', '"Behind" nghĩa là gì?', 'What does "behind" mean?', ['Phía sau', 'Phía trước', 'Bên trên', 'Bên trong'], 1),
    q('Prepositions', 'medium', 'Điền vào: The bird is ___ the tree.', 'Fill in: The bird is ___ the tree.', ['in', 'at', 'to', 'off'], 1),
    q('Prepositions', 'easy', '"Next to" nghĩa là gì?', 'What does "next to" mean?', ['Bên cạnh', 'Phía trên', 'Phía dưới', 'Phía sau'], 1),
    q('Prepositions', 'medium', 'Chọn câu đúng:', 'Choose the correct sentence:', ['The pen is on the desk.', 'The pen is on desk.', 'The pen on is desk.', 'Pen is on the desk.'], 1),
    q('Prepositions', 'hard', '"Between" nghĩa là gì?', 'What does "between" mean?', ['Ở giữa', 'Bên ngoài', 'Phía trước', 'Phía sau'], 1),
    q('Prepositions', 'hard', 'Điền vào: She sits ___ Tom and Jerry.', 'Fill in: She sits ___ Tom and Jerry.', ['between', 'on', 'under', 'in'], 1),

    // ── Questions (10) ──
    q('Questions', 'easy', '"What" nghĩa là gì?', 'What does "what" mean?', ['Cái gì', 'Ai', 'Ở đâu', 'Khi nào'], 1),
    q('Questions', 'easy', '"Where" dùng để hỏi gì?', 'What does "where" ask about?', ['Nơi chốn', 'Thời gian', 'Lý do', 'Số lượng'], 1),
    q('Questions', 'easy', 'Điền vào: ___ is your name?', 'Fill in: ___ is your name?', ['What', 'Where', 'When', 'Why'], 1),
    q('Questions', 'medium', 'Điền vào: ___ do you live?', 'Fill in: ___ do you live?', ['Where', 'What', 'Who', 'Why'], 1),
    q('Questions', 'medium', '"Who" dùng để hỏi gì?', 'What does "who" ask about?', ['Người', 'Vật', 'Nơi chốn', 'Thời gian'], 1),
    q('Questions', 'medium', 'Điền vào: ___ is she? — She is my sister.', 'Fill in: ___ is she? — She is my sister.', ['Who', 'What', 'Where', 'When'], 1),
    q('Questions', 'medium', '"How old" dùng để hỏi gì?', 'What does "how old" ask about?', ['Tuổi', 'Tên', 'Nơi ở', 'Sở thích'], 1),
    q('Questions', 'hard', 'Chọn câu hỏi đúng:', 'Choose the correct question:', ['How are you?', 'How is you?', 'How am you?', 'How be you?'], 1),
    q('Questions', 'hard', 'Trả lời: "How old are you?" — ___', 'Answer: "How old are you?" — ___', ['I am seven years old.', 'I am fine.', 'I am a student.', 'I am at school.'], 1),
    q('Questions', 'medium', '"When" dùng để hỏi gì?', 'What does "when" ask about?', ['Thời gian', 'Nơi chốn', 'Người', 'Cách thức'], 1),
];

const seedEnglishQuestions = async () => {
    console.log('🌱 Seeding English questions to Supabase...');

    const allQuestions = [...vocabQuestions, ...grammarQuestions];
    console.log(`📦 Total questions to insert: ${allQuestions.length}`);

    const { error } = await supabase.from('questions').insert(allQuestions);

    if (error) {
        console.error('❌ Error seeding English questions:', error);
        process.exit(1);
    } else {
        console.log(`✅ Successfully seeded ${allQuestions.length} English questions`);
        console.log('   - Vocabulary: 50 (Animals, Colors, Numbers, Family, School)');
        console.log('   - Grammar: 50 (This/That, Verb to be, Simple present, Prepositions, Questions)');
    }
};

// seedEnglishQuestions();
