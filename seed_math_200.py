"""
Seed 200+ Grade 2 Math questions into Supabase.
Actual DB schema: subject, topic, difficulty, content (JSONB), choices (JSONB), correct_answer_id (int)
  content = {en: {questionText, questionReadText}, vi: {questionText, questionReadText}}
  choices = [{id: 1, label: "A", value: "..."}, {id: 2, label: "B", value: "..."}, ...]
  correct_answer_id = integer (1-4)
"""
import requests, json, sys
sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://adkoreafiamvnxamftva.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka29yZWFmaWFtdm54YW1mdHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTYyODQsImV4cCI6MjA4Nzc3MjI4NH0.HhgKe60miUzXumLHaSJqkI7hsA1CGwWNZ5PWql6ArwM"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def q(topic, vi, en, difficulty, correct_idx, opt_a, opt_b, opt_c, opt_d):
    """Helper: correct_idx is 0-based (0=A, 1=B, 2=C, 3=D)."""
    return {
        "subject": "math",
        "topic": topic,
        "difficulty": difficulty,
        "content": {
            "en": {"questionText": en, "questionReadText": en},
            "vi": {"questionText": vi, "questionReadText": vi}
        },
        "choices": [
            {"id": 1, "label": "A", "value": opt_a},
            {"id": 2, "label": "B", "value": opt_b},
            {"id": 3, "label": "C", "value": opt_c},
            {"id": 4, "label": "D", "value": opt_d}
        ],
        "correct_answer_id": correct_idx + 1  # Convert 0-based to 1-based
    }

questions = []

# ==========================================
# 1. ÔN TẬP CÁC SỐ ĐẾN 100 (15 câu)
# ==========================================
questions.append(q("Ôn tập số đến 100", "Số liền trước của 30 là?", "Predecessor of 30?", "easy", 0, "29", "31", "20", "30"))
questions.append(q("Ôn tập số đến 100", "Số liền sau của 49 là?", "Successor of 49?", "easy", 1, "48", "50", "51", "60"))
questions.append(q("Ôn tập số đến 100", "Số 96 gồm mấy chục và mấy đơn vị?", "96 = ? tens and ? units", "easy", 0, "9 chục 6 đơn vị", "6 chục 9 đơn vị", "90 chục", "96 đơn vị"))
questions.append(q("Ôn tập số đến 100", "Số bé nhất có hai chữ số là?", "Smallest 2-digit number?", "easy", 1, "01", "10", "11", "99"))
questions.append(q("Ôn tập số đến 100", "Số lớn nhất có hai chữ số là?", "Largest 2-digit number?", "easy", 1, "90", "99", "100", "89"))
questions.append(q("Ôn tập số đến 100", "Sắp xếp từ bé đến lớn: 34, 12, 56, 21", "Order smallest to largest: 34,12,56,21", "medium", 0, "12, 21, 34, 56", "12, 34, 21, 56", "56, 34, 21, 12", "21, 12, 56, 34"))
questions.append(q("Ôn tập số đến 100", "Số gấp đôi của 10 là?", "Double of 10?", "easy", 1, "10", "20", "5", "15"))
questions.append(q("Ôn tập số đến 100", "Số nào ở giữa 67 và 69?", "Number between 67 and 69?", "easy", 2, "66", "70", "68", "65"))
questions.append(q("Ôn tập số đến 100", "Từ 1 đến 10 có bao nhiêu số?", "How many numbers from 1 to 10?", "easy", 1, "9", "10", "11", "8"))
questions.append(q("Ôn tập số đến 100", "Một nửa của 20 là?", "Half of 20?", "easy", 1, "5", "10", "15", "20"))
questions.append(q("Ôn tập số đến 100", "Số liền trước của 15 là?", "Predecessor of 15?", "easy", 0, "14", "16", "15", "13"))
questions.append(q("Ôn tập số đến 100", "Số liền sau của 89 là?", "Successor of 89?", "easy", 1, "88", "90", "91", "80"))
questions.append(q("Ôn tập số đến 100", "Số 75 gồm mấy chục và mấy đơn vị?", "75 = ? tens and ? units", "easy", 1, "5 chục 7 đơn vị", "7 chục 5 đơn vị", "70 chục", "75 đơn vị"))
questions.append(q("Ôn tập số đến 100", "Số nào lớn nhất: 45, 54, 39, 61?", "Largest: 45, 54, 39, 61?", "easy", 3, "45", "54", "39", "61"))
questions.append(q("Ôn tập số đến 100", "Số nào bé nhất: 12, 21, 10, 20?", "Smallest: 12, 21, 10, 20?", "easy", 2, "12", "21", "10", "20"))

# ==========================================
# 2. PHÉP CỘNG TRỪ CƠ BẢN (15 câu)
# ==========================================
questions.append(q("Cộng trừ cơ bản", "Trong 15 + 4 = 19, số 15 gọi là gì?", "In 15+4=19, what is 15 called?", "easy", 0, "Số hạng", "Tổng", "Hiệu", "Số trừ"))
questions.append(q("Cộng trừ cơ bản", "Tổng của 20 và 30?", "Sum of 20 and 30?", "easy", 0, "50", "40", "60", "10"))
questions.append(q("Cộng trừ cơ bản", "Trong 50 - 20 = 30, số 50 gọi là gì?", "In 50-20=30, what is 50 called?", "easy", 0, "Số bị trừ", "Số trừ", "Hiệu", "Tổng"))
questions.append(q("Cộng trừ cơ bản", "Hiệu của 45 và 5?", "Difference of 45 and 5?", "easy", 1, "50", "40", "45", "35"))
questions.append(q("Cộng trừ cơ bản", "10 + ... = 10. Điền số?", "10 + ... = 10. Fill in?", "easy", 2, "1", "10", "0", "2"))
questions.append(q("Cộng trừ cơ bản", "20 + 10 = ?", "20 + 10 = ?", "easy", 0, "30", "20", "40", "10"))
questions.append(q("Cộng trừ cơ bản", "40 - 20 = ?", "40 - 20 = ?", "easy", 1, "30", "20", "10", "40"))
questions.append(q("Cộng trừ cơ bản", "30 + 30 = ?", "30 + 30 = ?", "easy", 2, "50", "30", "60", "70"))
questions.append(q("Cộng trừ cơ bản", "70 - 40 = ?", "70 - 40 = ?", "easy", 0, "30", "40", "20", "10"))
questions.append(q("Cộng trừ cơ bản", "50 + 0 = ?", "50 + 0 = ?", "easy", 1, "0", "50", "55", "45"))
questions.append(q("Cộng trừ cơ bản", "80 - 80 = ?", "80 - 80 = ?", "easy", 0, "0", "80", "8", "1"))
questions.append(q("Cộng trừ cơ bản", "25 + 5 = ?", "25 + 5 = ?", "easy", 0, "30", "20", "35", "25"))
questions.append(q("Cộng trừ cơ bản", "99 - 9 = ?", "99 - 9 = ?", "easy", 1, "99", "90", "89", "91"))
questions.append(q("Cộng trừ cơ bản", "Tổng của 0 và 5?", "Sum of 0 and 5?", "easy", 0, "5", "0", "50", "10"))
questions.append(q("Cộng trừ cơ bản", "Hiệu của 10 và 10?", "Difference of 10 and 10?", "easy", 0, "0", "10", "20", "1"))

# ==========================================
# 3. BẢNG CỘNG 9 + x (10 câu)
# ==========================================
for j, s in [(1,10),(2,11),(3,12),(4,13),(5,14),(6,15),(7,16),(8,17),(9,18)]:
    questions.append(q("Bảng cộng 9", f"9 + {j} = ?", f"9 + {j} = ?", "easy", 1, str(s-1), str(s), str(s+1), str(s+2)))
questions.append(q("Bảng cộng 9", "19 + 9 = ?", "19 + 9 = ?", "medium", 2, "27", "29", "28", "30"))

# ==========================================
# 4. BẢNG CỘNG 8 + x (10 câu)
# ==========================================
for j, s in [(2,10),(3,11),(4,12),(5,13),(6,14),(7,15),(8,16),(9,17)]:
    questions.append(q("Bảng cộng 8", f"8 + {j} = ?", f"8 + {j} = ?", "easy", 1, str(s-1), str(s), str(s+1), str(s+2)))
questions.append(q("Bảng cộng 8", "28 + 8 = ?", "28 + 8 = ?", "medium", 2, "34", "35", "36", "37"))
questions.append(q("Bảng cộng 8", "8 + 8 = ?", "8 + 8 = ?", "easy", 1, "15", "16", "17", "18"))

# ==========================================
# 5. BẢNG CỘNG 7 + x (10 câu)
# ==========================================
for j, s in [(3,10),(4,11),(5,12),(6,13),(7,14),(8,15),(9,16)]:
    questions.append(q("Bảng cộng 7", f"7 + {j} = ?", f"7 + {j} = ?", "easy", 1, str(s-1), str(s), str(s+1), str(s+2)))
questions.append(q("Bảng cộng 7", "7 + 7 = ?", "7 + 7 = ?", "easy", 1, "13", "14", "15", "16"))
questions.append(q("Bảng cộng 7", "17 + 7 = ?", "17 + 7 = ?", "medium", 2, "23", "25", "24", "26"))
questions.append(q("Bảng cộng 7", "37 + 7 = ?", "37 + 7 = ?", "medium", 0, "44", "45", "43", "46"))

# ==========================================
# 6. BẢNG CỘNG 6 + x (10 câu)
# ==========================================
for j, s in [(4,10),(5,11),(6,12),(7,13),(8,14),(9,15)]:
    questions.append(q("Bảng cộng 6", f"6 + {j} = ?", f"6 + {j} = ?", "easy", 1, str(s-1), str(s), str(s+1), str(s+2)))
questions.append(q("Bảng cộng 6", "16 + 6 = ?", "16 + 6 = ?", "medium", 0, "22", "23", "24", "21"))
questions.append(q("Bảng cộng 6", "26 + 6 = ?", "26 + 6 = ?", "medium", 1, "31", "32", "33", "30"))
questions.append(q("Bảng cộng 6", "36 + 6 = ?", "36 + 6 = ?", "medium", 2, "41", "43", "42", "44"))
questions.append(q("Bảng cộng 6", "46 + 6 = ?", "46 + 6 = ?", "medium", 1, "51", "52", "53", "50"))

# ==========================================
# 7-12. BẢNG TRỪ 11-18 (34 câu)
# ==========================================
for base in range(11, 19):
    min_j = base - 9  # smallest subtrahend that gives positive single digit result
    for j in range(max(2, min_j), 10):
        d = base - j
        if 1 <= d <= 9:
            questions.append(q(f"Bảng trừ {base}", f"{base} - {j} = ?", f"{base} - {j} = ?", "easy", 1, str(d-1), str(d), str(d+1), str(d+2)))

# ==========================================
# 13. CỘNG TRỪ CÓ NHỚ 2 CHỮ SỐ (20 câu)
# ==========================================
questions.append(q("Cộng trừ có nhớ", "25 + 7 = ?", "25 + 7 = ?", "medium", 1, "31", "32", "33", "30"))
questions.append(q("Cộng trừ có nhớ", "38 + 5 = ?", "38 + 5 = ?", "medium", 2, "42", "44", "43", "41"))
questions.append(q("Cộng trừ có nhớ", "47 + 6 = ?", "47 + 6 = ?", "medium", 0, "53", "54", "52", "55"))
questions.append(q("Cộng trừ có nhớ", "56 + 8 = ?", "56 + 8 = ?", "medium", 3, "63", "65", "62", "64"))
questions.append(q("Cộng trừ có nhớ", "69 + 4 = ?", "69 + 4 = ?", "medium", 2, "72", "74", "73", "71"))
questions.append(q("Cộng trừ có nhớ", "74 + 9 = ?", "74 + 9 = ?", "medium", 0, "83", "84", "82", "85"))
questions.append(q("Cộng trừ có nhớ", "86 + 7 = ?", "86 + 7 = ?", "medium", 2, "92", "94", "93", "91"))
questions.append(q("Cộng trừ có nhớ", "35 + 18 = ?", "35 + 18 = ?", "medium", 0, "53", "54", "52", "55"))
questions.append(q("Cộng trừ có nhớ", "46 + 27 = ?", "46 + 27 = ?", "medium", 2, "72", "74", "73", "71"))
questions.append(q("Cộng trừ có nhớ", "58 + 34 = ?", "58 + 34 = ?", "medium", 1, "91", "92", "93", "90"))
questions.append(q("Cộng trừ có nhớ", "32 - 7 = ?", "32 - 7 = ?", "medium", 0, "25", "24", "26", "23"))
questions.append(q("Cộng trừ có nhớ", "41 - 5 = ?", "41 - 5 = ?", "medium", 2, "35", "37", "36", "34"))
questions.append(q("Cộng trừ có nhớ", "53 - 8 = ?", "53 - 8 = ?", "medium", 1, "44", "45", "46", "43"))
questions.append(q("Cộng trừ có nhớ", "64 - 9 = ?", "64 - 9 = ?", "medium", 0, "55", "54", "56", "53"))
questions.append(q("Cộng trừ có nhớ", "72 - 6 = ?", "72 - 6 = ?", "medium", 2, "65", "67", "66", "64"))
questions.append(q("Cộng trừ có nhớ", "85 - 37 = ?", "85 - 37 = ?", "hard", 1, "47", "48", "49", "46"))
questions.append(q("Cộng trừ có nhớ", "63 - 28 = ?", "63 - 28 = ?", "hard", 0, "35", "34", "36", "33"))
questions.append(q("Cộng trừ có nhớ", "91 - 45 = ?", "91 - 45 = ?", "hard", 2, "45", "47", "46", "44"))
questions.append(q("Cộng trừ có nhớ", "50 - 16 = ?", "50 - 16 = ?", "medium", 3, "33", "35", "36", "34"))
questions.append(q("Cộng trừ có nhớ", "100 - 47 = ?", "100 - 47 = ?", "hard", 0, "53", "54", "52", "55"))

# ==========================================
# 14. BÀI TOÁN CÓ LỜI VĂN (15 câu)
# ==========================================
questions.append(q("Bài toán có lời văn", "Lan có 15 cái kẹo, Mai nhiều hơn Lan 5 cái. Mai có mấy cái?", "Lan has 15 candies, Mai has 5 more. How many does Mai have?", "medium", 1, "10", "20", "15", "25"))
questions.append(q("Bài toán có lời văn", "Minh có 12 bút, Tùng ít hơn 4 cái. Tùng có mấy cái?", "Minh has 12 pens, Tung has 4 fewer. How many?", "medium", 1, "16", "8", "7", "9"))
questions.append(q("Bài toán có lời văn", "Mẹ có 11 trứng, dùng 4 quả. Còn mấy quả?", "Mom has 11 eggs, uses 4. How many left?", "medium", 1, "6", "7", "8", "15"))
questions.append(q("Bài toán có lời văn", "Túi A 9kg gạo, túi B nhiều hơn 5kg. Túi B mấy kg?", "Bag A: 9kg rice, B has 5kg more. How much in B?", "medium", 1, "13", "14", "15", "4"))
questions.append(q("Bài toán có lời văn", "Lớp 2A: 30 HS, lớp 2B ít hơn 2. Lớp 2B mấy HS?", "Class 2A: 30, 2B has 2 fewer. Students in 2B?", "medium", 0, "28", "32", "30", "29"))
questions.append(q("Bài toán có lời văn", "An có 8 bi, Bình nhiều hơn 6. Bình có mấy viên?", "An has 8 marbles, Binh has 6 more. How many?", "medium", 1, "13", "14", "2", "15"))
questions.append(q("Bài toán có lời văn", "Hoa hái 16 bông, Mai ít hơn 7. Mai hái mấy bông?", "Hoa picked 16 flowers, Mai 7 fewer. How many?", "medium", 0, "9", "23", "10", "8"))
questions.append(q("Bài toán có lời văn", "Nhà An 25 gà, nhà Bình nhiều hơn 8. Nhà Bình mấy con?", "An: 25 chickens, Binh has 8 more. How many?", "medium", 2, "32", "34", "33", "17"))
questions.append(q("Bài toán có lời văn", "Anh có 40 kẹo, cho em 15 cái. Anh còn mấy cái?", "40 candies, gives 15. How many left?", "medium", 0, "25", "55", "30", "20"))
questions.append(q("Bài toán có lời văn", "Vườn có 18 cam và 7 bưởi. Tổng mấy cây?", "18 orange + 7 pomelo trees. Total?", "medium", 0, "25", "11", "26", "24"))
questions.append(q("Bài toán có lời văn", "Lớp có 35 HS, 20 nữ. Bao nhiêu nam?", "35 students, 20 girls. How many boys?", "medium", 2, "55", "20", "15", "14"))
questions.append(q("Bài toán có lời văn", "Xe buýt 42 người, 17 xuống. Còn mấy người?", "Bus: 42 people, 17 get off. How many remain?", "medium", 0, "25", "59", "24", "26"))
questions.append(q("Bài toán có lời văn", "Tùng có 13 vở, mẹ mua thêm 9. Tổng mấy quyển?", "13 notebooks + 9 more. Total?", "medium", 1, "21", "22", "23", "4"))
questions.append(q("Bài toán có lời văn", "50 bi đỏ, 28 bi xanh. Đỏ hơn xanh mấy viên?", "50 red, 28 blue marbles. How many more red?", "medium", 1, "78", "22", "23", "21"))
questions.append(q("Bài toán có lời văn", "Đội A trồng 45 cây, đội B 38 cây. Tổng?", "Team A: 45, Team B: 38 trees. Total?", "hard", 2, "7", "82", "83", "84"))

# ==========================================
# 15. HÌNH HỌC (15 câu)
# ==========================================
questions.append(q("Hình học", "Đoạn thẳng có mấy đầu mút?", "How many endpoints in a segment?", "easy", 1, "1", "2", "3", "4"))
questions.append(q("Hình học", "Dụng cụ đo độ dài đoạn thẳng?", "Tool to measure segment length?", "easy", 1, "Compa", "Thước thẳng", "Ê-ke", "Bút chì"))
questions.append(q("Hình học", "Tam giác có mấy cạnh?", "Triangle has how many sides?", "easy", 2, "2", "4", "3", "5"))
questions.append(q("Hình học", "Hình vuông có mấy cạnh?", "Square has how many sides?", "easy", 1, "3", "4", "5", "6"))
questions.append(q("Hình học", "Hình chữ nhật có mấy góc vuông?", "Rectangle has how many right angles?", "easy", 1, "2", "4", "3", "1"))
questions.append(q("Hình học", "Các cạnh hình vuông như thế nào?", "Sides of a square are?", "easy", 0, "Bằng nhau", "Không bằng nhau", "2 cạnh bằng", "3 cạnh bằng"))
questions.append(q("Hình học", "Đường gấp khúc ABC có bao nhiêu đoạn?", "Zigzag ABC has how many segments?", "easy", 1, "1", "2", "3", "4"))
questions.append(q("Hình học", "3 điểm thẳng hàng nghĩa là gì?", "Collinear points means?", "easy", 0, "Cùng nằm trên 1 đường thẳng", "Tạo tam giác", "Song song", "Vuông góc"))
questions.append(q("Hình học", "Hình tròn có mấy cạnh?", "Circle has how many sides?", "easy", 0, "0", "1", "2", "Vô số"))
questions.append(q("Hình học", "Chu vi tam giác cạnh 3, 4, 5 cm?", "Perimeter: triangle 3,4,5 cm?", "medium", 1, "11 cm", "12 cm", "13 cm", "10 cm"))
questions.append(q("Hình học", "Chu vi hình vuông cạnh 5 cm?", "Perimeter: square side 5 cm?", "medium", 1, "15 cm", "20 cm", "25 cm", "10 cm"))
questions.append(q("Hình học", "Chu vi HCN dài 6, rộng 4 cm?", "Perimeter: rect 6x4 cm?", "medium", 1, "10 cm", "20 cm", "24 cm", "18 cm"))
questions.append(q("Hình học", "Đường gấp khúc ABCD có mấy đoạn?", "Zigzag ABCD: how many segments?", "easy", 2, "2", "4", "3", "5"))
questions.append(q("Hình học", "Hình nào là đường thẳng?", "Which is a straight line?", "easy", 2, "Đường cong", "Đường gấp khúc", "Đường thẳng", "Đường tròn"))
questions.append(q("Hình học", "Đường gấp khúc khép kín là hình gì?", "Closed zigzag is what?", "medium", 0, "Đa giác", "Đường thẳng", "Đường tròn", "Đoạn thẳng"))

# ==========================================
# 16. ĐƠN VỊ ĐO (20 câu)
# ==========================================
questions.append(q("Đơn vị đo", "1 dm = ? cm", "1 dm = ? cm", "easy", 1, "1 cm", "10 cm", "100 cm", "0 cm"))
questions.append(q("Đơn vị đo", "20 cm = ? dm", "20 cm = ? dm", "easy", 0, "2 dm", "20 dm", "1 dm", "3 dm"))
questions.append(q("Đơn vị đo", "5 dm = ? cm", "5 dm = ? cm", "easy", 1, "5 cm", "50 cm", "500 cm", "15 cm"))
questions.append(q("Đơn vị đo", "1 dm + 5 dm = ?", "1 dm + 5 dm = ?", "easy", 1, "6 cm", "6 dm", "60 dm", "15 dm"))
questions.append(q("Đơn vị đo", "10 dm - 2 dm = ?", "10 dm - 2 dm = ?", "easy", 1, "8 cm", "8 dm", "12 dm", "80 cm"))
questions.append(q("Đơn vị đo", "1 m = ? cm", "1 m = ? cm", "easy", 2, "10 cm", "50 cm", "100 cm", "1000 cm"))
questions.append(q("Đơn vị đo", "1 m = ? dm", "1 m = ? dm", "easy", 1, "1 dm", "10 dm", "100 dm", "5 dm"))
questions.append(q("Đơn vị đo", "3 m = ? dm", "3 m = ? dm", "medium", 0, "30 dm", "3 dm", "300 dm", "13 dm"))
questions.append(q("Đơn vị đo", "1 km = ? m", "1 km = ? m", "medium", 2, "10 m", "100 m", "1000 m", "10000 m"))
questions.append(q("Đơn vị đo", "1 m 20 cm = ? cm", "1m 20cm = ? cm", "medium", 0, "120 cm", "12 cm", "102 cm", "210 cm"))
questions.append(q("Đơn vị đo", "Đơn vị đo khối lượng?", "Unit for mass?", "easy", 2, "cm", "dm", "kg", "lít"))
questions.append(q("Đơn vị đo", "Đơn vị đo dung tích?", "Unit for capacity?", "easy", 3, "cm", "m", "kg", "lít"))
questions.append(q("Đơn vị đo", "Bao gạo 10 kg. Hai bao = ? kg", "Bag 10kg. Two bags = ?", "easy", 1, "10 kg", "20 kg", "15 kg", "12 kg"))
questions.append(q("Đơn vị đo", "Can 5 lít, dùng 2 lít. Còn?", "Can 5L, used 2L. Left?", "easy", 2, "7 lít", "2 lít", "3 lít", "5 lít"))
questions.append(q("Đơn vị đo", "40 cm + 60 cm = ?", "40 cm + 60 cm = ?", "medium", 0, "100 cm", "10 cm", "10 dm", "1 dm"))
questions.append(q("Đơn vị đo", "100 cm = ? m", "100 cm = ? m", "medium", 0, "1 m", "10 m", "100 m", "0 m"))
questions.append(q("Đơn vị đo", "50 dm = ? m", "50 dm = ? m", "medium", 1, "50 m", "5 m", "500 m", "0.5 m"))
questions.append(q("Đơn vị đo", "15 kg - 7 kg = ?", "15 kg - 7 kg = ?", "easy", 1, "7 kg", "8 kg", "9 kg", "22 kg"))
questions.append(q("Đơn vị đo", "3 lít + 4 lít = ?", "3L + 4L = ?", "easy", 2, "1 lít", "12 lít", "7 lít", "34 lít"))
questions.append(q("Đơn vị đo", "Đơn vị đo chiều dài?", "Unit for length?", "easy", 0, "cm", "kg", "lít", "giờ"))

# ==========================================
# 17. THỜI GIAN (10 câu)
# ==========================================
questions.append(q("Thời gian", "1 giờ = ? phút", "1 hour = ? minutes", "easy", 1, "30 phút", "60 phút", "100 phút", "24 phút"))
questions.append(q("Thời gian", "1 ngày = ? giờ", "1 day = ? hours", "easy", 2, "12 giờ", "20 giờ", "24 giờ", "48 giờ"))
questions.append(q("Thời gian", "Kim ngắn chỉ 3, kim dài chỉ 12. Mấy giờ?", "Short hand 3, long hand 12. What time?", "easy", 0, "3 giờ", "12 giờ", "3 giờ 12", "15 phút"))
questions.append(q("Thời gian", "Kim ngắn chỉ 8, kim dài chỉ 6. Mấy giờ?", "Short hand 8, long hand 6. What time?", "medium", 1, "8 giờ", "8 giờ 30", "6 giờ 8", "8 giờ 6"))
questions.append(q("Thời gian", "1 tuần = ? ngày", "1 week = ? days", "easy", 2, "5 ngày", "6 ngày", "7 ngày", "10 ngày"))
questions.append(q("Thời gian", "Kim dài chỉ 12 là mấy phút?", "Long hand at 12 = ? minutes", "easy", 0, "0 phút", "12 phút", "60 phút", "30 phút"))
questions.append(q("Thời gian", "Nửa giờ = ? phút", "Half hour = ? minutes", "easy", 1, "15 phút", "30 phút", "45 phút", "60 phút"))
questions.append(q("Thời gian", "2 giờ = ? phút", "2 hours = ? minutes", "medium", 2, "60 phút", "90 phút", "120 phút", "180 phút"))
questions.append(q("Thời gian", "1 năm = ? tháng", "1 year = ? months", "easy", 1, "10 tháng", "12 tháng", "24 tháng", "6 tháng"))
questions.append(q("Thời gian", "Em đi học lúc mấy giờ sáng?", "School starts at?", "easy", 0, "7 giờ sáng", "7 giờ tối", "12 giờ trưa", "2 giờ chiều"))

# ==========================================
# 18. SỐ CHẴN LẺ (5 câu)
# ==========================================
questions.append(q("Số chẵn lẻ", "Số nào là số chẵn?", "Which is even?", "easy", 1, "1", "2", "3", "5"))
questions.append(q("Số chẵn lẻ", "Số nào là số lẻ?", "Which is odd?", "easy", 2, "2", "4", "7", "8"))
questions.append(q("Số chẵn lẻ", "Số chẵn nhỏ nhất > 0?", "Smallest even number > 0?", "easy", 1, "0", "2", "1", "4"))
questions.append(q("Số chẵn lẻ", "Số chẵn từ 2 đến 10?", "Even numbers 2 to 10?", "easy", 0, "2, 4, 6, 8, 10", "1, 3, 5, 7, 9", "2, 3, 4, 5, 6", "1, 2, 3, 4, 5"))
questions.append(q("Số chẵn lẻ", "Số lẻ từ 1 đến 9?", "Odd numbers 1 to 9?", "easy", 1, "2, 4, 6, 8", "1, 3, 5, 7, 9", "1, 2, 3, 4, 5", "3, 6, 9"))

# ==========================================
# 19. BẢNG NHÂN 2, 3 (20 câu)
# ==========================================
for i in range(1, 11):
    p = 2 * i
    questions.append(q("Bảng nhân 2", f"2 x {i} = ?", f"2 × {i} = ?", "easy", 1, str(p-1), str(p), str(p+1), str(p+2)))
for i in range(1, 11):
    p = 3 * i
    questions.append(q("Bảng nhân 3", f"3 x {i} = ?", f"3 × {i} = ?", "easy", 1, str(p-1), str(p), str(p+1), str(p+2)))

# ==========================================
# 20. BẢNG CHIA 2, 3 (10 câu)
# ==========================================
for dividend in [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]:
    quotient = dividend // 2
    questions.append(q("Bảng chia 2", f"{dividend} : 2 = ?", f"{dividend} ÷ 2 = ?", "easy", 1, str(quotient-1), str(quotient), str(quotient+1), str(quotient+2)))

print(f"Total questions generated: {len(questions)}")

# Save JSON for inspection
with open("d:/ung dung/Dinh-Hau-Nguyen/seed_math_200.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)
print("Saved to seed_math_200.json")

# Insert into Supabase in batches of 50
url = f"{SUPABASE_URL}/rest/v1/questions"
batch_size = 50
success = 0
for i in range(0, len(questions), batch_size):
    batch = questions[i:i+batch_size]
    payload = json.dumps(batch, ensure_ascii=False)
    resp = requests.post(url, headers=HEADERS, data=payload.encode("utf-8"))
    if resp.status_code in (200, 201):
        success += len(batch)
        print(f"  Batch {i//batch_size + 1}: inserted {len(batch)} questions OK")
    else:
        print(f"  Batch {i//batch_size + 1} FAILED ({resp.status_code}): {resp.text[:200]}")

print(f"\nDone! Inserted {success}/{len(questions)} math questions.")
