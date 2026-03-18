import { supabase } from './supabaseClient.js';

// Helper to build a question object
export function q(topic: string, diff: string, vi: string, en: string, choices: string[], correct: number, imageUrl?: string, subject: string = 'science') {
    return {
        subject,
        topic,
        difficulty: diff,
        content: {
            vi: { questionText: vi, questionReadText: vi, imageUrl },
            en: { questionText: en, questionReadText: en, imageUrl },
        },
        choices: choices.map((v, i) => ({ id: i + 1, value: v, label: String.fromCharCode(65 + i) })),
        correct_answer_id: correct,
    };
}

export const familyQuestions = [
    q('Gia đình', 'easy', 'Trong gia đình, ai là người sinh ra bố?', 'In the family, who gave birth to your father?', ['Ông nội', 'Bà nội', 'Ông ngoại', 'Bà ngoại'], 2),
    q('Gia đình', 'easy', 'Để phòng tránh ngộ độc thực phẩm, chúng ta nên làm gì?', 'To prevent food poisoning, what should we do?', ['Ăn thức ăn ôi thiu', 'Ăn chín, uống sôi', 'Ăn rau chưa rửa', 'Uống nước lã'], 2),
    q('Gia đình', 'easy', 'Khi ở nhà, em nên làm gì để giúp đỡ bố mẹ?', 'What should you do to help your parents at home?', ['Xem tivi cả ngày', 'Quét nhà, gấp quần áo', 'Bày đồ chơi ra sàn', 'Ngủ nướng'], 2),
    q('Gia đình', 'medium', 'Tại sao chúng ta cần giữ vệ sinh nhà ở?', 'Why do we need to keep our house clean?', ['Để nhà đẹp và sạch mầm bệnh', 'Để tốn thời gian', 'Để bố mẹ mắng', 'Để kiến bò vào'], 1),
    q('Gia đình', 'easy', 'Ông ngoại là người sinh ra ai?', 'Who did your maternal grandfather give birth to?', ['Bố', 'Mẹ', 'Chú', 'Cô'], 2),
    q('Gia đình', 'easy', 'Anh trai của bố được gọi là gì?', 'What do you call your father\'s older brother?', ['Chú', 'Bác', 'Cậu', 'Dì'], 2),
    q('Gia đình', 'medium', 'Đồ vật nào trong nhà có thể gây nguy hiểm nếu không cẩn thận?', 'Which item at home can be dangerous if not careful?', ['Gấu bông', 'Dao, kéo, ổ điện', 'Gối ngủ', 'Sách vở'], 2),
    q('Gia đình', 'easy', 'Việc nào sau đây giúp nhà cửa thoáng mát?', 'Which action helps keep the house cool and airy?', ['Đóng kín tất cả cửa', 'Mở cửa sổ, dọn dẹp gọn gàng', 'Tích trữ rác', 'Nuôi nhiều chuột'], 2),
    q('Gia đình', 'medium', 'Khi thấy em bé nghịch ổ điện, em nên làm gì?', 'What should you do when you see a baby playing with an outlet?', ['Chơi cùng em', 'Ngăn em lại và báo người lớn', 'Mặc kệ em', 'Tắt tivi'], 2),
    q('Gia đình', 'hard', 'Các thế hệ trong gia đình bao gồm những ai thường gặp?', 'Which generations are common in a family?', ['Ông bà, bố mẹ, con cái', 'Bạn bè, hàng xóm', 'Thầy cô, học sinh', 'Bác sĩ, bệnh nhân'], 1),
    q('Gia đình', 'easy', 'Cưới hỏi là sự kiện gì trong gia đình?', 'Is a wedding an event in the family?', ['Sự kiện đau buồn', 'Sự kiện vui vẻ, trọng đại', 'Ngày bình thường', 'Ngày đi học'], 2),
    q('Gia đình', 'medium', 'Em nên cất bát đĩa ở đâu sau khi rửa sạch?', 'Where should you store dishes after washing?', ['Dưới gầm giường', 'Trên giá bát khô ráo', 'Ngoài sân', 'Trong tủ quần áo'], 2),
    q('Gia đình', 'easy', 'Ngôi nhà là nơi để làm gì?', 'What is a home for?', ['Để gia đình cùng chung sống', 'Để đi lạc', 'Để làm vỡ đồ', 'Để bỏ hoang'], 1),
    q('Gia đình', 'medium', 'Thực phẩm nào dễ gây ngộ độc nếu để lâu?', 'Which food causes poisoning if left for long?', ['Gạo khô', 'Thức ăn đã ôi thiu, nấm mốc', 'Muối ăn', 'Đường'], 2),
    q('Gia đình', 'easy', 'Em gọi mẹ của mẹ là gì?', 'What do you call your mother\'s mother?', ['Bà nội', 'Bà ngoại', 'Cô', 'Dì'], 2),
    q('Gia đình', 'hard', 'Ngày giỗ trong gia đình là dịp để làm gì?', 'What is an anniversary of death (giỗ) for in a family?', ['Để đi chơi công viên', 'Để tưởng nhớ tổ tiên, người đã khuất', 'Để thi học kỳ', 'Để mua đồ chơi mới'], 2),
    q('Gia đình', 'medium', 'Tại sao không nên ăn thức ăn chưa được rửa sạch?', 'Why shouldn\'t we eat unwashed food?', ['Vì nó ngon', 'Vì chứa vi khuẩn và thuốc trừ sâu', 'Vì nó đắt', 'Vì nó có màu đẹp'], 2),
    q('Gia đình', 'easy', 'Người thân trong gia đình cần đối xử với nhau như thế nào?', 'How should family members treat each other?', ['Ghen ghét', 'Yêu thương, hùm bọc', 'Bỏ mặc', 'Đánh nhau'], 2),
    q('Gia đình', 'hard', 'Dọn dẹp nhà cửa định kỳ có tác dụng gì?', 'What is the effect of periodic house cleaning?', ['Làm mệt người', 'Tiêu diệt nơi trú ngụ của côn trùng gây bệnh', 'Làm hỏng đồ đạc', 'Tốn tiền điện'], 2),
    q('Gia đình', 'medium', 'Khi bị đau bụng sau khi ăn, em nên làm gì?', 'What should you do if you have a stomach ache after eating?', ['Tự uống thuốc', 'Báo ngay cho bố mẹ hoặc người lớn', 'Cố gắng chịu đựng', 'Đi ngủ tiếp'], 2),
];

export const schoolQuestions = [
    q('Trường học', 'easy', 'Ai là người dạy dỗ em ở trường?', 'Who teaches you at school?', ['Bác bảo vệ', 'Cô giáo, thầy giáo', 'Bác tài xế', 'Cửa hàng trưởng'], 2),
    q('Trường học', 'easy', 'Nơi nào trong trường có nhiều sách để đọc?', 'Where in school can you find many books to read?', ['Nhà kho', 'Thư viện', 'Sân vận động', 'Nhà vệ sinh'], 2),
    q('Trường học', 'easy', 'Khi gặp thầy cô giáo, em nên làm gì?', 'What should you do when you meet your teachers?', ['Bỏ chạy', 'Chào hỏi lễ phép', 'Im lặng', 'Chơi game'], 2),
    q('Trường học', 'medium', 'Đồ dùng nào em dùng để kẻ đường thẳng?', 'Which tool matches a straight line?', ['Cục tẩy', 'Thước kẻ', 'Bút bi', 'Vở bài tập'], 2),
    q('Trường học', 'easy', 'Giờ ra chơi, em nên chơi ở đâu?', 'Where should you play during recess?', ['Trong lớp học', 'Sân trường', 'Cổng trường', 'Thư viện'], 2),
    q('Trường học', 'medium', 'Hành động nào giúp giữ gìn vệ sinh trường lớp?', 'Which action helps keep the school clean?', ['Vứt rác bừa bãi', 'Bỏ rác vào thùng', 'Vẽ bậy lên bàn', 'Ngắt hoa'], 2),
    q('Trường học', 'easy', 'Phòng y tế trong trường dùng để làm gì?', 'What is the school clinic for?', ['Để ăn trưa', 'Chăm sóc học sinh khi bị ốm/đau', 'Để đá bóng', 'Để hát karaoke'], 2),
    q('Trường học', 'medium', 'Tại sao em không nên chạy nhảy trên cầu thang?', 'Why shouldn\'t you run on the stairs?', ['Vì sẽ mệt', 'Dễ bị ngã, gây tai nạn nguy hiểm', 'Vì tốn giày', 'Vì thầy cô mắng'], 2),
    q('Trường học', 'hard', 'Các hoạt động chính ở trường tiểu học là gì?', 'What are the main activities in primary school?', ['Học tập và rèn luyện đạo đức', 'Đi du lịch', 'Làm việc kiếm tiền', 'Chơi game cả ngày'], 1),
    q('Trường học', 'medium', 'Em nên làm gì khi thấy bạn vứt rác ra sân trường?', 'What should you do when you see a friend littering at school?', ['Vứt cùng bạn', 'Nhắc bạn nhặt lên và bỏ vào thùng', 'Mặc kệ', 'Mắng bạn'], 2),
    q('Trường học', 'easy', 'Bàn ghế trong lớp học cần được giữ gìn thế nào?', 'How should classroom furniture be kept?', ['Vẽ tên lên bàn', 'Không vẽ bậy, không làm hỏng', 'Nhảy lên bàn', 'Để bụi bẩn'], 2),
    q('Trường học', 'medium', 'Ngày khai giảng là ngày gì?', 'What is opening day?', ['Ngày kết thúc năm học', 'Ngày bắt đầu năm học mới', 'Ngày nghỉ Tết', 'Ngày hội thể thao'], 2),
    q('Trường học', 'easy', 'Học sinh có nhiệm vụ gì quan trọng nhất?', 'What is the most important task for students?', ['Chăm chỉ học hành', 'Lười biếng', 'Cãi lời thầy cô', 'Quên sách vở'], 1),
    q('Trường học', 'hard', 'An toàn trường học có nghĩa là gì?', 'What does school safety mean?', ['Học sinh được học trong môi trường lành mạnh, không nguy hiểm', 'Học sinh được nghỉ học', 'Chỉ có giáo viên được an toàn', 'Cổng trường đóng kín'], 1),
    q('Trường học', 'medium', 'Em dùng gì để viết bài vào vở?', 'What do you use to write in your notebook?', ['Cái thước', 'Bút mực, bút chì', 'Hộp màu', 'Cái gối'], 2),
    q('Trường học', 'easy', 'Tiếng trống trường báo hiệu điều gì?', 'What does the school drum signal?', ['Giờ ăn kem', 'Giờ vào lớp hoặc tan trường', 'Giờ đi ngủ', 'Giờ xem phim'], 2),
    q('Trường học', 'medium', 'Khi làm việc nhóm, em nên làm gì?', 'What should you do when working in a group?', ['Làm một mình', 'Lắng nghe và thảo luận cùng các bạn', 'Ngồi chơi', 'Tranh giành đồ chơi'], 2),
    q('Trường học', 'hard', 'Tại sao chúng ta phải yêu quý trường lớp?', 'Why should we love our school?', ['Vì ở đó có đồ chơi', 'Vì trường là nơi cho ta kiến thức và bạn bè', 'Vì trường rất to', 'Vì bố mẹ bắt buộc'], 2),
    q('Trường học', 'easy', 'Cái bảng trong lớp có màu gì thông thường?', 'What color is the classroom board usually?', ['Xanh lá hoặc đen', 'Đỏ', 'Vàng', 'Hồng'], 1),
    q('Trường học', 'medium', 'Em nên chuẩn bị sách vở như thế nào trước khi đi học?', 'How should you prepare your books before going to school?', ['Để bừa bãi', 'Sắp xếp theo thời khóa biểu', 'Chỉ mang một quyển', 'Không mang gì'], 2),
];

export const communityQuestions = [
    q('Cộng đồng', 'easy', 'Nơi nào mọi người thường đến để mua bán hàng hóa?', 'Where do people often go to buy and sell goods?', ['Công viên', 'Chợ, siêu thị', 'Rạp chiếu phim', 'Sân vận động'], 2),
    q('Cộng đồng', 'easy', 'Hành động nào đúng khi tham gia giao thông?', 'Which action is correct when participating in traffic?', ['Vượt đèn đỏ', 'Đội mũ bảo hiểm khi đi xe máy', 'Chạy ra giữa đường', 'Buông cả hai tay'], 2),
    q('Cộng đồng', 'medium', 'Tại sao chúng ta cần tuân thủ luật giao thông?', 'Why do we need to follow traffic laws?', ['Để không bị phạt', 'Đảm bảo an toàn cho mình và người khác', 'Để đi nhanh hơn', 'Để khoe với bạn'], 2),
    q('Cộng đồng', 'easy', 'Khi đi bộ trên đường, em nên đi ở đâu?', 'Where should you walk on the street?', ['Giữa đường', 'Trên vỉa hè', 'Dưới lòng đường', 'Đi bên trái'], 2),
    q('Cộng đồng', 'medium', 'Biển báo giao thông hình tròn, viền đỏ, nền trắng có ý nghĩa gì?', 'What does a circular traffic sign with a red border and white background mean?', ['Biển báo nguy hiểm', 'Biển báo cấm', 'Biển chỉ dẫn', 'Biển hiệu lệnh'], 2),
    q('Cộng đồng', 'easy', 'Ai là người điều khiển giao thông trên đường?', 'Who controls traffic on the street?', ['Bác nông dân', 'Chú cảnh sát giao thông', 'Vận động viên', 'Phi hành gia'], 2),
    q('Cộng đồng', 'medium', 'Nơi nào cung cấp dịch vụ khám chữa bệnh cho cộng đồng?', 'Where provides medical care for the community?', ['Bưu điện', 'Trạm y tế, bệnh viện', 'Trường học', 'Nhà hát'], 2),
    q('Cộng đồng', 'easy', 'Cổng làng, lũy tre thường thấy ở đâu?', 'Where are village gates and bamboo fences usually seen?', ['Thành phố', 'Nông thôn', 'Biển', 'Núi'], 2),
    q('Cộng đồng', 'hard', 'Các nghề nghiệp nào phổ biến ở địa phương em?', 'What occupations are common in your locality?', ['Nông dân, thợ may, giáo viên...', 'Siêu anh hùng', 'Cướp biển', 'Phi mạ'], 1),
    q('Cộng đồng', 'medium', 'Để giữ gìn cảnh quan cộng đồng, em nên làm gì?', 'To preserve the community landscape, what should you do?', ['Hái hoa công cộng', 'Không xả rác, bảo vệ cây xanh', 'Vẽ bậy lên tường', 'Phá hỏng ghế đá'], 2),
    q('Cộng đồng', 'easy', 'Khi thấy đèn giao thông chuyển sang màu đỏ, em phải làm gì?', 'What must you do when the traffic light turns red?', ['Đi tiếp', 'Dừng lại', 'Đi chậm lại', 'Tăng tốc'], 2),
    q('Cộng đồng', 'medium', 'Cửa hàng tạp hóa bán những gì?', 'What does a grocery store sell?', ['Chỉ bán quần áo', 'Các mặt hàng thiết yếu hằng ngày', 'Chỉ bán ti vi', 'Chỉ bán xe máy'], 2),
    q('Cộng đồng', 'easy', 'Bưu điện là nơi để làm gì?', 'What is the post office for?', ['Để đá bóng', 'Gửi thư từ, bưu phẩm', 'Để ăn sáng', 'Để tắm'], 2),
    q('Cộng đồng', 'hard', 'Các sự kiện văn hóa cộng đồng thường gồm những gì?', 'What do community cultural events often include?', ['Lễ hội, hội làng, tết trung thu', 'Đi ngủ sớm', 'Làm bài tập', 'Mua sắm cá nhân'], 1),
    q('Cộng đồng', 'medium', 'Khi đi qua đường, em cần lưu ý điều gì?', 'What should you notice when crossing the street?', ['Vừa đi vừa chạy', 'Quan sát xe cộ và đi theo vạch kẻ đường cho người đi bộ', 'Nhắm mắt lại', 'Cắm cúi nhìn điện thoại'], 2),
    q('Cộng đồng', 'easy', 'Đèn vàng báo hiệu điều gì?', 'What does the yellow light signal?', ['Đi nhanh nhanh', 'Chuẩn bị dừng lại', 'Được đi thoải mái', 'Tắt máy xe'], 2),
    q('Cộng đồng', 'medium', 'Nghề nông dân tạo ra sản phẩm gì?', 'What products does a farmer create?', ['Máy tính', 'Lúa gạo, rau củ quả', 'Quần áo thời trang', 'Ô tô'], 2),
    q('Cộng đồng', 'hard', 'Ủy ban nhân dân xã/phường có vai trò gì?', 'What is the role of the local People\'s Committee?', ['Để bán hàng', 'Quản lý đời sống và thủ tục hành chính tại địa phương', 'Để tổ chức dạ tiệc', 'Để dạy học'], 2),
    q('Cộng đồng', 'easy', 'Trong siêu thị, hàng hóa được sắp xếp như thế nào?', 'How are goods arranged in a supermarket?', ['Để lẫn lộn', 'Phân theo khu vực túi loại hàng', 'Để dưới sàn nhà', 'Để trong thùng kín'], 2),
    q('Cộng đồng', 'medium', 'Bảo vệ môi trường sống ở địa phương là trách nhiệm của ai?', 'Whose responsibility is it to protect the local environment?', ['Chỉ người lớn', 'Tất cả mọi người dân', 'Chỉ lao công', 'Chỉ cảnh sát'], 2),
];

export const natureQuestions = [
    q('Tự nhiên', 'easy', 'Cây xanh cần gì để sống và phát triển?', 'What do plants need to live and grow?', ['Ánh sáng, nước, không khí, đất', 'Kẹo ngọt', 'Nước giải khát', 'Tivi'], 1),
    q('Tự nhiên', 'easy', 'Con vật nào có thể bay trên bầu trời?', 'Which animal can fly in the sky?', ['Cá vàng', 'Chim sơn ca', 'Con thỏ', 'Con sâu'], 2),
    q('Tự nhiên', 'easy', 'Cá sống ở môi trường nào?', 'What environment does a fish live in?', ['Trên cạn', 'Dưới nước', 'Trong hang đá', 'Trên cây'], 2),
    q('Tự nhiên', 'medium', 'Thân cây có nhiệm vụ gì?', 'What is the purpose of the plant stem?', ['Hút nước từ đất', 'Nâng đỡ cây và vận chuyển chất dinh dưỡng', 'Nở hoa', 'Đậu quả'], 2),
    q('Tự nhiên', 'easy', 'Con vật nào sau đây là thú nuôi trong nhà?', 'Which of the following is a domestic pet?', ['Con hổ', 'Con mèo', 'Con cá mập', 'Con voi'], 2),
    q('Tự nhiên', 'medium', 'Hành động nào thể hiện sự bảo vệ động vật?', 'Which action shows protection for animals?', ['Săn bắn bừa bãi', 'Chăm sóc và không đánh đập vật nuôi', 'Nhốt chim vào lồng hẹp', 'Bỏ đói động vật'], 2),
    q('Tự nhiên', 'easy', 'Lá cây thường có màu gì?', 'What color are leaves usually?', ['Màu đỏ', 'Màu xanh lá cây', 'Màu vàng', 'Màu hồng'], 2),
    q('Tự nhiên', 'medium', 'Con vật nào sau đây vừa sống dưới nước vừa sống trên cạn?', 'Which animal lives both in water and on land?', ['Con cá', 'Con ếch', 'Con gà', 'Con bướm'], 2),
    q('Tự nhiên', 'easy', 'Hoa có tác dụng gì chủ yếu?', 'What is the main purpose of a flower?', ['Làm đẹp và tạo quả/hạt', 'Để cây nặng thêm', 'Để che nắng', 'Để làm thuốc độc'], 1),
    q('Tự nhiên', 'medium', 'Tại sao chúng ta không nên ngắt hoa lá ở công viên?', 'Why shouldn\'t we pick flowers and leaves at the park?', ['Vì tốn công làm sạch', 'Để bảo vệ cảnh quan và giúp cây phát triển', 'Vì hoa có gai', 'Vì hoa bẩn'], 2),
    q('Tự nhiên', 'easy', 'Rễ cây nằm ở đâu?', 'Where are plant roots located?', ['Trên ngọn cây', 'Dưới mặt đất', 'Trên cành', 'Trong bông hoa'], 2),
    q('Tự nhiên', 'medium', 'Bộ phận nào của cây giúp cây hút nước và chất khoáng?', 'Which part of the plant absorbs water and minerals?', ['Lá', 'Rễ', 'Cành', 'Hoa'], 2),
    q('Tự nhiên', 'hard', 'Môi trường sống của thực vật và động vật gồm những loại nào?', 'What are the types of habitats for plants and animals?', ['Trên cạn và dưới nước', 'Trong phòng ngủ', 'Trên mặt trăng', 'Trong máy tính'], 1),
    q('Tự nhiên', 'medium', 'Con vật nào giúp người nông dân cày ruộng?', 'Which animal helps farmers plow the fields?', ['Con mèo', 'Con trâu', 'Con chó', 'Con lợn'], 2),
    q('Tự nhiên', 'easy', 'Cây lúa cung cấp loại lương thực nào?', 'What food does the rice plant provide?', ['Ngô', 'Gạo', 'Khoai', 'Sắn'], 2),
    q('Tự nhiên', 'medium', 'Động vật cần những điều kiện gì để sống?', 'What conditions do animals need to live?', ['Thức ăn, nước uống, không khí, nơi ở', 'Chỉ cần đồ chơi', 'Chỉ cần tivi', 'Chỉ cần bánh kẹo'], 1),
    q('Tự nhiên', 'easy', 'Con bướm được sinh ra từ đâu qua quá trình biến thái?', 'Where is a butterfly born from through metamorphosis?', ['Từ trứng phát triển thành sâu rồi thành bướm', 'Từ đá', 'Từ cây', 'Từ mây'], 1),
    q('Tự nhiên', 'hard', 'Tại sao thực vật lại quan trọng đối với con người?', 'Why are plants important to humans?', ['Cung cấp thức ăn và oxy để thở', 'Làm cây cối rậm rạp', 'Để chúng ta đi chặt', 'Làm đất bẩn'], 1),
    q('Tự nhiên', 'medium', 'Cách bảo vệ môi trường sống cho cá là gì?', 'How to protect the habitat for fish?', ['Đổ rác xuống sông', 'Giữ nguồn nước sạch, không ô nhiễm', 'Câu hết cá', 'Lấp ao hồ'], 2),
    q('Tự nhiên', 'easy', 'Vòi của con voi thực chất là bộ phận nào?', 'An elephant\'s trunk is actually which part?', ['Cái đuôi', 'Cái mũi kéo dài', 'Cái chân', 'Cái tai'], 2),
];

export const healthQuestions = [
    q('Sức khỏe', 'easy', 'Bộ phận nào giúp em đi lại, chạy nhảy?', 'Which part helps you walk and run?', ['Đôi tay', 'Đôi chân', 'Cái đầu', 'Cái lưng'], 2),
    q('Sức khỏe', 'easy', 'Chúng ta nên đánh răng ít nhất mấy lần mỗi ngày?', 'How many times should we brush our teeth daily at least?', ['1 lần', '2 lần (sáng và tối)', 'Không cần đánh', 'Chỉ khi ăn kẹo'], 2),
    q('Sức khỏe', 'easy', 'Khi hắt hơi hoặc ho, em nên làm gì?', 'What should you do when sneezing or coughing?', ['Hắt hơi vào mặt bạn', 'Dùng khăn tay hoặc khuỷu tay che miệng', 'Không làm gì', 'Hét thật to'], 2),
    q('Sức khỏe', 'medium', 'Cơ quan nào trong cơ thể giúp em thở?', 'Which organ in your body helps you breathe?', ['Cơ quan tiêu hóa', 'Cơ quan hô hấp (phổi)', 'Cơ quan vận động', 'Cơ quan bài tiết'], 2),
    q('Sức khỏe', 'easy', 'Tại sao chúng ta phải rửa tay trước khi ăn?', 'Why must we wash our hands before eating?', ['Để tay thơm', 'Để loại bỏ vi khuẩn gây bệnh', 'Để tay ướt', 'Để tốn xà phòng'], 2),
    q('Sức khỏe', 'medium', 'Xương và cơ thuộc cơ quan nào?', 'Bones and muscles belong to which organ system?', ['Cơ quan hô hấp', 'Cơ quan vận động', 'Cơ quan bài tiết', 'Cơ quan tiêu hóa'], 2),
    q('Sức khỏe', 'easy', 'Em nên đi ngủ lúc mấy giờ là tốt nhất?', 'What time is best to go to bed for children?', ['12 giờ đêm', 'Trước 9-10 giờ tối', 'Thức cả đêm', '3 giờ sáng'], 2),
    q('Sức khỏe', 'medium', 'Cơ quan bài tiết nước tiểu gồm những bộ phận nào?', 'Which parts does the urinary system include?', ['Tim và mạch máu', 'Thận, ống dẫn nước tiểu, bóng đái, ống đái', 'Phổi và khí quản', 'Dạ dày và ruột'], 2),
    q('Sức khỏe', 'easy', 'Ăn nhiều rau xanh có tác dụng gì?', 'What is the effect of eating a lot of vegetables?', ['Làm bụng đau', 'Cung cấp vitamin và giúp tiêu hóa tốt', 'Làm răng sâu', 'Làm cơ thể yếu đi'], 2),
    q('Sức khỏe', 'medium', 'Khi bị sốt, em nên làm gì?', 'What should you do when you have a fever?', ['Chạy nhảy ngoài nắng', 'Báo bố mẹ và nghỉ ngơi', 'Uống nước đá', 'Đi tắm nước lạnh'], 2),
    q('Sức khỏe', 'easy', 'Tại sao không nên xem tivi quá gần hoặc quá lâu?', 'Why shouldn\'t we watch TV too close or for too long?', ['Để tốn điện', 'Để bảo vệ đôi mắt', 'Vì tivi mệt', 'Vì tivi hỏng'], 2),
    q('Sức khỏe', 'medium', 'Tư thế ngồi học đúng là thế nào?', 'What is the correct study posture?', ['Ngồi vẹo lưng', 'Ngồi thẳng lưng, mắt cách vở khoảng 25-30cm', 'Nằm ra bàn', 'Chống cằm'], 2),
    q('Sức khỏe', 'hard', 'Tiêm chủng (portal vắc-xin) có lợi ích gì?', 'What are the benefits of vaccination?', ['Làm đau trẻ em', 'Giúp cơ thể phòng ngừa các bệnh truyền nhiễm nguy hiểm', 'Làm tốn tiền', 'Để trẻ em không đi chơi'], 2),
    q('Sức khỏe', 'medium', 'Tại sao cần phải tắm rửa hằng ngày?', 'Why do we need to bathe daily?', ['Để tốn nước', 'Giữ cơ thể sạch sẽ, thơm tho và loại bỏ vi khuẩn', 'Để làm ướt quần áo', 'Để bố mẹ vui'], 2),
    q('Sức khỏe', 'easy', 'Đồ uống nào tốt nhất cho cơ thể hằng ngày?', 'Which drink is best for the body daily?', ['Nước ngọt có gas', 'Nước lọc tinh khiết', 'Rượu bia', 'Cà phê đặc'], 2),
    q('Sức khỏe', 'hard', 'Các cơ quan trong cơ thể cần được bảo vệ như thế nào?', 'How should organs in the body be protected?', ['Tập thể dục, ăn uống điều độ và giữ vệ sinh', 'Để mặc chúng', 'Ăn thật nhiều đồ ngọt', 'Không bao giờ vận động'], 1),
    q('Sức khỏe', 'medium', 'Khi tai bị đau hoặc có dị vật chui vào, em làm gì?', 'What do you do when your ear hurts or an object gets in?', ['Dùng que chọc vào', 'Báo ngay cho người lớn hoặc bác sĩ', 'Mặc kệ nó', 'Đổ nước vào tai'], 2),
    q('Sức khỏe', 'easy', 'Vận động thể dục hằng ngày giúp cơ thể như thế nào?', 'How does daily exercise help the body?', ['Làm mệt mỏi', 'Giúp cơ bắp và xương chắc khỏe, tinh thần sảng khoái', 'Làm cơ thể yếu đi', 'Làm buồn ngủ'], 2),
    q('Sức khỏe', 'medium', 'Hành động nào gây hại cho phổi?', 'Which action harms the lungs?', ['Tập hít thở không khí trong lành', 'Hút thuốc hoặc ngửi khói thuốc lá', 'Trồng nhiều cây xanh', 'Đeo khẩu trang khi bụi'], 2),
    q('Sức khỏe', 'easy', 'Tại sao em cần cắt móng tay, móng chân thường xuyên?', 'Why do you need to cut your nails regularly?', ['Để cho đẹp', 'Để vi khuẩn không trú ngụ dưới kẽ móng', 'Để móng tay không dài', 'Để tốn kéo'], 2),
];

export const earthSkyQuestions = [
    q('Trái đất', 'easy', 'Bầu trời ban ngày có gì chiếu sáng rực rỡ?', 'What shines brightly in the sky during the day?', ['Mặt trăng', 'Mặt trời', 'Các vì sao', 'Đèn điện'], 2),
    q('Trái đất', 'easy', 'Một năm thường có mấy mùa ở miền Bắc Việt Nam?', 'How many seasons are there in Northern Vietnam?', ['2 mùa', '4 mùa (Xuân, Hạ, Thu, Đông)', '1 mùa', '5 mùa'], 2),
    q('Trái đất', 'easy', 'Hiện tượng gì xảy ra khi những giọt nước rơi từ đám mây xuống đất?', 'What phenomenon happens when water droplets fall from clouds to earth?', ['Nắng', 'Mưa', 'Gió', 'Tuyết'], 2),
    q('Trái đất', 'medium', 'Tại sao không nên nhìn trực tiếp vào mặt trời?', 'Why shouldn\'t you look directly at the sun?', ['Vì nó xa', 'Vì ánh sáng mạnh gây hại cho mắt', 'Vì mặt trời sẽ buồn', 'Vì nó nóng'], 2),
    q('Trái đất', 'easy', 'Mặt trăng và các vì sao thường xuất hiện khi nào?', 'When do the moon and stars usually appear?', ['Ban ngày', 'Ban đêm', 'Giờ trưa', 'Khi trời mưa'], 2),
    q('Trái đất', 'medium', 'Lốc xoáy, bão, lũ lụt được gọi chung là gì?', 'What are tornadoes, storms, and floods called together?', ['Trò chơi thiên nhiên', 'Thiên tai', 'Lễ hội bầu trời', 'Hiện tượng kỳ thú'], 2),
    q('Trái đất', 'easy', 'Hình dạng Trái đất của chúng ta như thế nào?', 'What is the shape of our Earth?', ['Hình vuông', 'Hình cầu (như quả bóng)', 'Hình tam giác', 'Hình cái đĩa'], 2),
    q('Trái đất', 'medium', 'Mùa nào trong năm thường có thời tiết nóng nhất?', 'Which season is usually the hottest?', ['Mùa đông', 'Mùa hạ (mùa hè)', 'Mùa xuân', 'Mùa thu'], 2),
    q('Trái đất', 'easy', 'Hành động nào giúp giảm nhẹ tác động của biến đổi khí hậu?', 'Which action helps mitigate the impact of climate change?', ['Chặt phá rừng', 'Trồng cây xanh và tiết kiệm năng lượng', 'Xả rác bừa bãi', 'Lãng phí nước'], 2),
    q('Trái đất', 'medium', 'Khi có giông sét, em không nên đứng ở đâu?', 'Where shouldn\'t you stand during lightning?', ['Trong nhà', 'Dưới gốc cây to hoặc nơi trống trải', 'Dưới hầm', 'Trong ô tô'], 2),
    q('Trái đất', 'easy', 'Gió là gì?', 'What is wind?', ['Sự chuyển động của không khí', 'Sự rơi của nước', 'Ánh sáng mặt trời', 'Tiếng động của lá'], 1),
    q('Trái đất', 'medium', 'Tại sao mùa đông chúng ta phải mặc áo ấm?', 'Why must we wear warm clothes in winter?', ['Để cho đẹp', 'Để giữ ấm cơ thể vì thời tiết lạnh', 'Để dễ ngủ', 'Vì bố mẹ bắt'], 2),
    q('Trái đất', 'hard', 'Thủy triều là hiện tượng gì?', 'What is the phenomenon of tides?', ['Nước biển dâng lên và hạ xuống định kỳ', 'Mưa lớn', 'Sóng thần', 'Gió bão'], 1),
    q('Trái đất', 'medium', 'Cầu vồng thường xuất hiện khi nào?', 'When does a rainbow often appear?', ['Trong đêm tối', 'Sau cơn mưa khi có ánh nắng mặt trời', 'Khi trời bão lớn', 'Giữa trưa nắng gắt'], 2),
    q('Trái đất', 'easy', 'Nước có ở đâu trên trái đất?', 'Where is water on earth?', ['Chỉ ở trong chai', 'Đại dương, sông ngòi, hồ, dưới đất...', 'Chỉ ở trong mây', 'Chỉ có ở nhà em'], 2),
    q('Trái đất', 'hard', 'Bầu khí quyển có tác dụng gì?', 'What is the purpose of the atmosphere?', ['Để chứa máy bay', 'Bảo vệ trái đất và cung cấp không khí để thở', 'Làm bầu trời xanh', 'Để chứa mây'], 2),
    q('Trái đất', 'medium', 'Tại sao có ngày và đêm?', 'Why are there day and night?', ['Mặt trời tắt đèn', 'Do Trái đất tự quay quanh trục của nó', 'Mặt trăng che mặt trời', 'Mây che khuất'], 2),
    q('Trái đất', 'easy', 'Sao Băng thực chất là gì?', 'What is a shooting star actually?', ['Một ngôi sao đang bay', 'Mảnh thiên thạch cháy sáng khi vào khí quyển', 'Đèn của phi thuyền', 'Pháo hoa'], 2),
    q('Trái đất', 'hard', 'Các cực của Trái Đất có đặc điểm gì?', 'What charateristics do Earth\'s poles have?', ['Rất nóng', 'Rất lạnh và bao phủ bởi băng tuyết', 'Có nhiều rừng rậm', 'Là các sa mạc cát'], 2),
    q('Trái đất', 'medium', 'Để phòng tránh lũ lụt, chúng ta nên làm gì?', 'To prevent floods, what should we do?', ['Xây nhiều nhà ven sông', 'Bảo vệ rừng đầu nguồn', 'Phá đê điều', 'Vứt rác xuống cống'], 2),
];

const seedScienceQuestions = async () => {
    console.log('🌱 Seeding Science questions to Supabase...');

    const allQuestions = [
        ...familyQuestions,
        ...schoolQuestions,
        ...communityQuestions,
        ...natureQuestions,
        ...healthQuestions,
        ...earthSkyQuestions,
    ];
    console.log(`📦 Total Science questions to insert: ${allQuestions.length}`);

    const { error } = await supabase.from('questions').insert(allQuestions);

    if (error) {
        console.error('❌ Error seeding Science questions:', error);
        process.exit(1);
    } else {
        console.log(`✅ Successfully seeded ${allQuestions.length} Science questions`);
        console.log('   - 6 Topics: Gia đình, Trường học, Cộng đồng, Tự nhiên, Sức khỏe, Trái đất');
    }
};

// seedScienceQuestions();
