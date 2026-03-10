import { supabase } from './supabaseClient.js';

const seedVietnameseQuestions = async () => {
    console.log('🌱 Seeding Vietnamese questions to Supabase...');

    const viQuestions = [
        {
            subject: 'vietnamese',
            topic: 'Em đã lớn hơn',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Tiêu đề bài 'Bé Mai Đã Lớn' có ý nghĩa gì?", questionReadText: "Tiêu đề bài Bé Mai Đã Lớn có ý nghĩa gì?" },
                en: { questionText: "What does the title 'Mai Has Grown Up' mean?", questionReadText: "What does the title Mai Has Grown up mean?" }
            },
            choices: [
                { id: 1, value: "Bé Mai trở nên lớn hơn", label: "A" },
                { id: 2, value: "Bé Mai vẫn còn nhỏ", label: "B" },
                { id: 3, value: "Bé Mai đi học muộn", label: "C" },
                { id: 4, value: "Bé Mai muốn đi chơi", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Em đã lớn hơn',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Câu nào nói về sự thay đổi khi em lớn hơn?", questionReadText: "Câu nào nói về sự thay đổi khi em lớn hơn?" },
                en: { questionText: "Which sentence describes a change as you grow up?", questionReadText: "Which sentence describes a change as you grow up?" }
            },
            choices: [
                { id: 1, value: "Em đã biết tự gấp quần áo", label: "A" },
                { id: 2, value: "Em vẫn cần mẹ bón cơm", label: "B" },
                { id: 3, value: "Em chưa biết đánh răng", label: "C" },
                { id: 4, value: "Em hay làm nũng bố mẹ", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Em đã lớn hơn',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Ăn chậm nhai ... giúp tiêu hóa tốt", questionReadText: "Ăn chậm nhai gì giúp tiêu hóa tốt?" },
                en: { questionText: "Eating slowly and chewing ... helps digestion", questionReadText: "Eating slowly and chewing what helps digestion?" }
            },
            choices: [
                { id: 1, value: "kỹ", label: "A" },
                { id: 2, value: "nhanh", label: "B" },
                { id: 3, value: "ít", label: "C" },
                { id: 4, value: "nhiều", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Em đã lớn hơn',
            difficulty: 'medium',
            content: {
                vi: { questionText: "Khi bạn khen ngợi em, em nên nói gì?", questionReadText: "Khi bạn khen ngợi em, em nên nói gì?" },
                en: { questionText: "What should you say when a friend praises you?", questionReadText: "What should you say when a friend praises you?" }
            },
            choices: [
                { id: 1, value: "Cảm ơn bạn", label: "A" },
                { id: 2, value: "Tớ biết rồi", label: "B" },
                { id: 3, value: "Không có gì", label: "C" },
                { id: 4, value: "Đừng khen tớ", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Mỗi người một vẻ',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bài 'Ngày Hôm Qua Đâu Rồi?' nói về điều gì?", questionReadText: "Bài Ngày Hôm Qua Đâu Rồi nói về điều gì?" },
                en: { questionText: "What is the poem 'Where Did Yesterday Go?' about?", questionReadText: "What is the poem Where Did Yesterday Go about?" }
            },
            choices: [
                { id: 1, value: "Thời gian trôi qua", label: "A" },
                { id: 2, value: "Những bông hoa đẹp", label: "B" },
                { id: 3, value: "Việc đi học", label: "C" },
                { id: 4, value: "Các trò chơi", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Mỗi người một vẻ',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Chữ hoa nào dưới đây viết đúng khuôn mẫu?", questionReadText: "Chữ hoa nào dưới đây viết đúng khuôn mẫu?" },
                en: { questionText: "Which capital letter below is written correctly?", questionReadText: "Which capital letter below is written correctly?" }
            },
            choices: [
                { id: 1, value: "Chữ Ă đúng nét", label: "A" },
                { id: 2, value: "Chữ Ă thiếu dấu", label: "B" },
                { id: 3, value: "Chữ Ă viết ngược", label: "C" },
                { id: 4, value: "Chữ Ă không có móc", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Mỗi người một vẻ',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Câu nào dưới đây giới thiệu về gia đình?", questionReadText: "Câu nào dưới đây giới thiệu về gia đình?" },
                en: { questionText: "Which sentence below introduces a family?", questionReadText: "Which sentence below introduces a family?" }
            },
            choices: [
                { id: 1, value: "Gia đình em có 4 người", label: "A" },
                { id: 2, value: "Em thích ăn kem", label: "B" },
                { id: 3, value: "Bầu trời rất xanh", label: "C" },
                { id: 4, value: "Con mèo đang ngủ", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Mỗi người một vẻ',
            difficulty: 'medium',
            content: {
                vi: { questionText: "Em sẽ nói gì để khen ngợi bạn?", questionReadText: "Em sẽ nói gì để khen ngợi bạn?" },
                en: { questionText: "What would you say to praise a friend?", questionReadText: "What would you say to praise a friend?" }
            },
            choices: [
                { id: 1, value: "Bạn giỏi lắm!", label: "A" },
                { id: 2, value: "Bạn đi đâu đấy?", label: "B" },
                { id: 3, value: "Bạn ăn cơm chưa?", label: "C" },
                { id: 4, value: "Bạn cho tớ mượn bút", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Bố mẹ yêu thương',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bài 'Cánh Đồng Của Bố' dạy em điều gì?", questionReadText: "Bài Cánh Đồng Của Bố dạy em điều gì?" },
                en: { questionText: "What does 'My Father's Field' teach you?", questionReadText: "What does My Father's Field teach you?" }
            },
            choices: [
                { id: 1, value: "Ý thức lao động và yêu quý bố mẹ", label: "A" },
                { id: 2, value: "Cách trồng lúa", label: "B" },
                { id: 3, value: "Cách bắt cá", label: "C" },
                { id: 4, value: "Tên các loài hoa", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Bố mẹ yêu thương',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bố mẹ yêu thương ... vô điều kiện", questionReadText: "Bố mẹ yêu thương ai vô điều kiện?" },
                en: { questionText: "Parents love ... unconditionally", questionReadText: "Parents love who unconditionally?" }
            },
            choices: [
                { id: 1, value: "con cái", label: "A" },
                { id: 2, value: "động vật", label: "B" },
                { id: 3, value: "đồ chơi", label: "C" },
                { id: 4, value: "hàng xóm", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Bố mẹ yêu thương',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Câu nào viết đúng câu: 'Mẹ yêu em'?", questionReadText: "Câu nào viết đúng câu Mẹ yêu em?" },
                en: { questionText: "Which sequence is correct: 'Mom loves me'?", questionReadText: "Which sequence is correct Mom loves me?" }
            },
            choices: [
                { id: 1, value: "Mẹ yêu em", label: "A" },
                { id: 2, value: "Mẹ ghét em", label: "B" },
                { id: 3, value: "Em yêu mẹ", label: "C" },
                { id: 4, value: "Bố yêu em", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Bố mẹ yêu thương',
            difficulty: 'medium',
            content: {
                vi: { questionText: "Câu nào là tin nhắn yêu thương gửi bố mẹ?", questionReadText: "Câu nào là tin nhắn yêu thương gửi bố mẹ?" },
                en: { questionText: "Which sentence is a loving message to parents?", questionReadText: "Which sentence is a loving message to parents?" }
            },
            choices: [
                { id: 1, value: "Con yêu bố mẹ rất nhiều", label: "A" },
                { id: 2, value: "Bố mẹ mua đồ chơi cho con đi", label: "B" },
                { id: 3, value: "Bố mẹ đang làm gì đấy?", label: "C" },
                { id: 4, value: "Con muốn đi ngủ", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Ông bà yêu quý',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bài 'Bà Tôi' giúp em tìm hiểu về điều gì?", questionReadText: "Bài Bà Tôi giúp em tìm hiểu về điều gì?" },
                en: { questionText: "What does the story 'My Grandmother' help you explore?", questionReadText: "What does the story My Grandmother help you explore?" }
            },
            choices: [
                { id: 1, value: "Tình cảm với ông bà", label: "A" },
                { id: 2, value: "Cách nấu ăn của bà", label: "B" },
                { id: 3, value: "Kỷ niệm đi chơi xa", label: "C" },
                { id: 4, value: "Các loài vật nuôi", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Ông bà yêu quý',
            difficulty: 'medium',
            content: {
                vi: { questionText: "Lời nào thường dùng để chúc ông bà?", questionReadText: "Lời nào thường dùng để chúc ông bà?" },
                en: { questionText: "Which words are common for wishing grandparents?", questionReadText: "Which words are common for wishing grandparents?" }
            },
            choices: [
                { id: 1, value: "Chúc ông bà luôn mạnh khỏe", label: "A" },
                { id: 2, value: "Chúc bạn học giỏi", label: "B" },
                { id: 3, value: "Chúc cô giáo xinh đẹp", label: "C" },
                { id: 4, value: "Chúc em bé hay ăn chóng lớn", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Ông bà yêu quý',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Từ 'yêu quý' có nghĩa là gì?", questionReadText: "Từ yêu quý có nghĩa là gì?" },
                en: { questionText: "What does the word 'beloved' mean?", questionReadText: "What does the word beloved mean?" }
            },
            choices: [
                { id: 1, value: "Yêu thương, trân trọng", label: "A" },
                { id: 2, value: "Ghét bỏ, xa lánh", label: "B" },
                { id: 3, value: "Sợ hãi, lo lắng", label: "C" },
                { id: 4, value: "Tức giận, buồn bã", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Những người bạn',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bài 'Ai Dậy Sớm' khuyên em điều gì?", questionReadText: "Bài Ai Dậy Sớm khuyên em điều gì?" },
                en: { questionText: "What does the poem 'Who Wakes Up Early' advise you?", questionReadText: "What does the poem Who Wakes Up Early advise you?" }
            },
            choices: [
                { id: 1, value: "Thói quen tốt, sự cần cù", label: "A" },
                { id: 2, value: "Nên ngủ nướng", label: "B" },
                { id: 3, value: "Chỉ nên chơi đùa", label: "C" },
                { id: 4, value: "Không cần đi học", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Những người bạn',
            difficulty: 'medium',
            content: {
                vi: { questionText: "Chuyện 'Phố Cây Xanh' khuyên chúng ta điều gì?", questionReadText: "Chuyện Phố Cây Xanh khuyên chúng ta điều gì?" },
                en: { questionText: "What does the story 'Green Tree Street' advise us?", questionReadText: "What does the story Green Tree Street advise us?" }
            },
            choices: [
                { id: 1, value: "Trồng nhiều cây xanh", label: "A" },
                { id: 2, value: "Đi xe đạp nhanh", label: "B" },
                { id: 3, value: "Ăn nhiều trái cây", label: "C" },
                { id: 4, value: "Xây nhiều nhà cao tầng", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Những người bạn',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bạn bè là những người ... gặp hàng ngày", questionReadText: "Bạn bè là những người như thế nào gặp hàng ngày?" },
                en: { questionText: "Friends are people who ... meet every day", questionReadText: "Friends are people who what meet every day?" }
            },
            choices: [
                { id: 1, value: "thân thiết / vui vẻ", label: "A" },
                { id: 2, value: "xa lạ / đáng sợ", label: "B" },
                { id: 3, value: "luôn cãi vã", label: "C" },
                { id: 4, value: "không quen biết", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Những người bạn',
            difficulty: 'medium',
            content: {
                vi: { questionText: "Câu nào dưới đây mô tả về một người bạn thân?", questionReadText: "Câu nào dưới đây mô tả về một người bạn thân?" },
                en: { questionText: "Which sentence below describes a best friend?", questionReadText: "Which sentence below describes a best friend?" }
            },
            choices: [
                { id: 1, value: "Bạn Lan luôn giúp đỡ em học tập", label: "A" },
                { id: 2, value: "Con mèo có bộ lông mượt", label: "B" },
                { id: 3, value: "Quyển sách này có nhiều tranh", label: "C" },
                { id: 4, value: "Trời hôm nay nhiều mây", label: "D" }
            ],
            correct_answer_id: 1
        },
        {
            subject: 'vietnamese',
            topic: 'Việc hàng ngày',
            difficulty: 'easy',
            content: {
                vi: { questionText: "Bài 'Đồng Hồ Báo Thức' nói về điều gì?", questionReadText: "Bài Đồng Hồ Báo Thức nói về điều gì?" },
                en: { questionText: "What is the story 'Alarm Clock' about?", questionReadText: "What is the story Alarm Clock about?" }
            },
            choices: [
                { id: 1, value: "Tầm quan trọng của việc thức dậy đúng giờ", label: "A" },
                { id: 2, value: "Cách tháo lắp đồng hồ", label: "B" },
                { id: 3, value: "Cách đi mua đồng hồ", label: "C" },
                { id: 4, value: "Màu sắc của kim đồng hồ", label: "D" }
            ],
            correct_answer_id: 1
        }
    ];

    const { error } = await supabase.from('questions').insert(viQuestions);

    if (error) {
        console.error('❌ Error seeding Vietnamese questions:', error);
    } else {
        console.log('✅ Successfully seeded 20 Vietnamese questions');
    }
};

seedVietnameseQuestions();
