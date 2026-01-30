import re
import json

file_path = 'src/db/questions_2025.ts'
report_path = '/Users/joao/.gemini/antigravity/brain/384a5b7b-6ab2-43de-9414-21f16631c224/audit_2025_questions.md'

with open(file_path, 'r') as f:
    content = f.read()

# Reliable regex extraction
stmts = re.findall(r'"statement":\s*"(.*?)"', content, re.DOTALL)
tag_blocks = re.findall(r'"tags":\s*\[(.*?)\]', content, re.DOTALL)
ids = re.findall(r'"id":\s*"(.*?)"', content)

exam1 = []
exam2 = []

for i in range(len(ids)):
    tags_str = tag_blocks[i]
    q = {
        'id': ids[i],
        'statement': stmts[i].replace(r'\n', ' ').strip(),
        'tags': tags_str
    }
    
    if '2025_1' in tags_str:
        exam1.append(q)
    else:
        exam2.append(q)

def write_section(f, title, questions):
    f.write(f"## {title} (Count: {len(questions)})\n\n")
    f.write("| ID | Snippet | Tags |\n")
    f.write("| :--- | :--- | :--- |\n")
    for q in questions:
        # truncate statement
        snippet = q['statement'][:100] + ("..." if len(q['statement']) > 100 else "")
        # clean snippet for markdown table
        snippet = snippet.replace('|', '\|').replace('\n', ' ')
        tags = q['tags'].replace('\n', '').replace('"', '').replace("'", "")
        f.write(f"| {q['id']} | {snippet} | {tags} |\n")
    f.write("\n")

with open(report_path, 'w') as f:
    f.write("# Audit Report: 2025 Exam Questions\n\n")
    f.write("This report lists all questions parsed from `questions_2025.ts`. Use this to identify extra questions.\n\n")
    
    write_section(f, "Exam 1 (Prova 1)", exam1)
    write_section(f, "Exam 2 (Prova 2)", exam2)

print(f"Report generated at {report_path}")
