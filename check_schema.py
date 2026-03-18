import requests, json, sys
sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://adkoreafiamvnxamftva.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka29yZWFmaWFtdm54YW1mdHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTYyODQsImV4cCI6MjA4Nzc3MjI4NH0.HhgKe60miUzXumLHaSJqkI7hsA1CGwWNZ5PWql6ArwM"
HEADERS = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Prefer": "count=exact"}

# Count math questions
r = requests.get(f"{SUPABASE_URL}/rest/v1/questions?subject=eq.math&select=id", headers={**HEADERS, "Range-Unit": "items", "Range": "0-0"})
math_count = r.headers.get("content-range", "unknown")
print(f"Math questions: {math_count}")

# Count all questions by subject
for subj in ["math", "vietnamese", "science", "english"]:
    r2 = requests.get(f"{SUPABASE_URL}/rest/v1/questions?subject=eq.{subj}&select=id", headers={**HEADERS, "Range-Unit": "items", "Range": "0-0"})
    cnt = r2.headers.get("content-range", "?")
    print(f"  {subj}: {cnt}")

# Total
r3 = requests.get(f"{SUPABASE_URL}/rest/v1/questions?select=id", headers={**HEADERS, "Range-Unit": "items", "Range": "0-0"})
total = r3.headers.get("content-range", "?")
print(f"  TOTAL: {total}")
