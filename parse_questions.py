
import re
import json

def parse_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    questions = {}

    # 1. Extract Questions (Item: X)
    # Pattern: Item: X ... (text) ... Item: Y (or end)
    # We strip "Item: " from the start.
    
    # Split by "Item: "
    # Note: This is simple but might be fragile if "Item: " appears in text.
    # But usually it's at start of line.
    
    blocks = re.split(r'\nItem:\s*(\d+)', content)
    # blocks[0] is header/intro
    # blocks[1] is number 1
    # blocks[2] is text for 1
    # blocks[3] is number 2
    # etc.
    
    for i in range(1, len(blocks), 2):
        q_num = int(blocks[i])
        q_text = blocks[i+1]
        
        # Parse statement and options
        # Options usually A. ... B. ... or A) ... B) ...
        # Let's find the last occurrence of options pattern.
        
        # We need to separate statement from options.
        # Options typically appear at the end.
        
        # Heuristic: Find lines starting with A., B., C., D., E. or A), B)...
        # But sometimes they are multiline.
        
        op_regex = re.compile(r'\n\s*([A-E])\s*[).]\s*(.*?)(?=\n\s*[A-E]\s*[).]|(\s*Item:)|(\s*$))', re.DOTALL)
        
        # Actually easier to just find the block of options at the end.
        # Let's look for "A)" or "A."
        
        ops = {}
        # Find start of A
        match_a = re.search(r'\n\s*A[).]\s*', q_text)
        if match_a:
            statement = q_text[:match_a.start()].strip()
            options_block = q_text[match_a.start():]
            
            # Split options
            # re.split with capturing group for delimiters
            parts = re.split(r'\n\s*([A-E])[).]\s*', options_block)
            # parts[0] empty
            # parts[1] is 'A'
            # parts[2] is text for A
            # parts[3] is 'B'
            # parts[4] is text for B
            
            for j in range(1, len(parts), 2):
                letter = parts[j]
                text = parts[j+1].strip()
                ops[letter] = text
        else:
            statement = q_text.strip()
            # Try parsing options if they are inline? Assume standard format for now.
        
        questions[q_num] = {
            "id": f"p2025_{q_num:03d}",
            "statement": statement,
            "options": ops,
            "answer": None,
            "theme": "geral", # default
            "subtheme": "Geral" # default
        }

    # 2. Extract Answers from Commentary
    # Commentary blocks start with just the number on a line, followed by "De acordo" or reference.
    # And contain "Alternativa correta"
    
    # We can use regex to find these blocks.
    # Pattern: ^\d+$ ... Alternativa correta ...
    
    # Let's iterate lines to find start of blocks
    lines = content.splitlines()
    current_q = None
    buffer = []
    
    for i, line in enumerate(lines):
        # Check for start of commentary block: Number alone on line
        if re.match(r'^\d+$', line.strip()):
            # Lookahead to verify it's a commentary header (next line starts with Ref)
            if i + 1 < len(lines) and (lines[i+1].strip().lower().startswith("de acordo") or lines[i+1].strip().lower().startswith("nardi")):
                current_q = int(line.strip())
                buffer = []
                continue
        
        if current_q is not None:
            buffer.append(line)
            # Check for answer in this line or previous
            # Check flexible regex
            # Case 1: "Alternativa correta: X"
            m1 = re.search(r'Alternativa correta:?\s*([A-E])', line, re.IGNORECASE)
            # Case 2: "Alternativa correta" on one line, "X)" on next
            # We handle Case 2 by keeping a buffer or checking next line?
            # Actually, let's just search the whole buffer when we switch questions.
            
            # Or better: Parsing the whole content for these patterns
            
    # Re-approach for answers:
    # Split content by the "N" headers basically.
    # But "N" headers are just numbers, hard to split by.
    
    # Regex find all blocks that look like:
    # \n(\d+)\n(De acordo.*?)(\n\d+\nDe acordo|\Z)
    
    comm_blocks = re.findall(r'\n(\d+)\n(De acordo.*?)(?=\n\d+\nDe acordo|\Z)', content, re.DOTALL | re.IGNORECASE)
    
    found_answers = 0
    for q_str, text in comm_blocks:
        q_num = int(q_str)
        # Find answer in text
        # Patterns:
        # 1. Alternativa correta: A
        # 2. Alternativa correta\n A)
        # 3. Alternativa correta\n A
        
        ans = None
        m = re.search(r'Alternativa correta:?\s*([A-E])', text, re.IGNORECASE)
        if m:
            ans = m.group(1).upper()
        else:
            # Try split line
            m2 = re.search(r'Alternativa correta\s*\n\s*([A-E])', text, re.IGNORECASE)
            if m2:
                ans = m2.group(1).upper()
        
        if ans and q_num in questions:
            questions[q_num]['answer'] = ans
            found_answers += 1
            
            # Also try to extract explanation (Justificativa)
            # Everything after "Alternativa correta..."
            if m:
                expl = text[m.end():].strip()
                questions[q_num]['explanation'] = expl
            elif m2:
                expl = text[m2.end():].strip()
                questions[q_num]['explanation'] = expl

    print(f"Parsed {len(questions)} questions.")
    print(f"Found {found_answers} answers.")
    
    # Generate typescript
    ts_content = "import { Question } from '../types';\n\nexport const questions2025Part2: Question[] = [\n"
    
    for q_num in sorted(questions.keys()):
        q = questions[q_num]
        if not q['options'] or not q['answer']:
            continue # Skip incomplete
            
        ts_content += "    {\n"
        ts_content += f"        id: '{q['id']}',\n"
        ts_content += f"        theme: '{q['theme']}',\n"
        ts_content += f"        subtheme: '{q['subtheme']}',\n"
        ts_content += f"        difficulty: 2,\n" # Default
        ts_content += f"        statement: {json.dumps(q['statement'])},\n"
        ts_content += "        options: {\n"
        for k, v in q['options'].items():
             ts_content += f"            {k}: {json.dumps(v)},\n"
        ts_content += "        },\n"
        ts_content += f"        correctAnswer: '{q['answer']}',\n"
        if 'explanation' in q:
             ts_content += f"        comment: {json.dumps(q['explanation'])},\n"
        ts_content += "    },\n"

    ts_content += "];\n"
    
    with open(r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\src\db\questions_2025_part2.ts", 'w', encoding='utf-8') as f:
        f.write(ts_content)

if __name__ == "__main__":
    parse_file(r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\extracted_questions.txt")
