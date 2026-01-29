
import json
import os

with open('parsed_2025_2.json', 'r', encoding='utf-8') as f:
    questions_2 = json.load(f)

# Convert to TS string
def to_ts(questions):
    lines = []
    for q in questions:
        q_str = "    {\n"
        q_str += f"        id: '{q['id']}',\n"
        q_str += f"        theme: '{q['theme']}',\n"
        q_str += f"        subtheme: '{q['subtheme']}',\n"
        q_str += f"        difficulty: {q['difficulty']},\n"
        q_str += f"        statement: {json.dumps(q['statement'], ensure_ascii=False)},\n"
        q_str += "        options: {\n"
        for opt, val in q['options'].items():
            q_str += f"            {opt}: {json.dumps(val, ensure_ascii=False)},\n"
        q_str += "        },\n"
        q_str += f"        correctAnswer: '{q['correctAnswer']}',\n"
        q_str += "        explanation: {\n"
        q_str += f"            correct: {json.dumps(q['explanation']['correct'], ensure_ascii=False)},\n"
        q_str += f"            keyConcepts: {json.dumps(q['explanation']['keyConcepts'], ensure_ascii=False)},\n"
        q_str += f"            examTip: {json.dumps(q['explanation']['examTip'], ensure_ascii=False)},\n"
        q_str += "        },\n"
        q_str += f"        tags: {json.dumps(q['tags'])}\n"
        q_str += "    }"
        lines.append(q_str)
    return ",\n".join(lines)

new_questions_ts = to_ts(questions_2)

# Read existing file
with open('src/db/questions_2025.ts', 'r', encoding='utf-8') as f:
    original_content = f.read()

# Find the end of the array
if "];" in original_content:
    parts = original_content.rsplit("];", 1)
    final_content = parts[0].rstrip()
    if not final_content.endswith(","):
        final_content += ","
    final_content += "\n" + new_questions_ts + "\n];"
    
    with open('src/db/questions_2025.ts', 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Merged questions into questions_2025.ts")
else:
    print("Could not find end of array in original file.")
