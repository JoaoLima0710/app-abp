
import json
import re

def normalize_text(q):
    # Use statement + concatenated options as the unique key
    opts_str = "".join([v for k, v in sorted(q['options'].items())])
    text = q['statement'] + opts_str
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

with open('ingested_2025_all.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

unique_questions = {}
for q in data:
    norm = normalize_text(q)
    if norm not in unique_questions or (not unique_questions[norm]['has_answer'] and q['has_answer']):
        unique_questions[norm] = q

final_list = list(unique_questions.values())
# Sort by ID
final_list.sort(key=lambda x: x['id'])

print(f"Final unique questions: {len(final_list)}")
print(f"With answers: {sum(1 for q in final_list if q['has_answer'])}")

# Convert to TS
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

ts_content = "import { Question } from '../types';\n\nexport const questions2025: Question[] = [\n"
ts_content += to_ts(final_list)
ts_content += "\n];\n"

with open('src/db/questions_2025.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)
