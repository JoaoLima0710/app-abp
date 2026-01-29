
import re
import os

def merge_and_fix():
    files = ['src/db/questions_2025.ts', 'src/db/questions_2025_part2.ts']
    all_content = []
    
    for f in files:
        if os.path.exists(f):
            with open(f, 'r', encoding='utf-8') as handle:
                all_content.append(handle.read())
    
    # Extract all question blocks
    # Logic: find { id: ... tags: [...] }
    # Using a more robust regex that doesn't rely on formatting but on structure
    full_text = "\n".join(all_content)
    
    # Simple regex to split based on "    {" at start of line
    # but let's be more precise
    q_blocks = re.findall(r'\{\s+id:.*?\n\s+tags: \[.*?\]\s+\}', full_text, re.DOTALL)
    
    unique_qs = {}
    for q in q_blocks:
        # Fix theme 'geral'
        q = q.replace("'geral'", "'neurociencias_diagnostico'")
        
        # Fix fused options
        q = re.sub(r'A: "(.*?)\.?\s+B\s+(.*?)",', r'A: "\1",\n            B: "\2",', q)
        
        # Fix missing options
        opt_match = re.search(r'options: \{(.*?)\}', q, re.DOTALL)
        if opt_match:
            opts = opt_match.group(1)
            for L in ['A', 'B', 'C', 'D', 'E']:
                if f'{L}:' not in opts:
                    opts = opts.rstrip()
                    if not opts.strip().endswith(','): opts += ','
                    opts += f'\n            {L}: "Referência bibliográfica pendente.",'
            q = q.replace(opt_match.group(1), opts)
            
        # Dedup by statement
        stmt_match = re.search(r'statement: (.*?),', q, re.DOTALL)
        if stmt_match:
            stmt = stmt_match.group(1).strip().lower()
            if stmt not in unique_qs:
                unique_qs[stmt] = q
    
    # Re-index
    sorted_qs = list(unique_qs.values())
    final_list = []
    for i, q in enumerate(sorted_qs):
        new_id = f'p2025_{str(i+1).zfill(3)}'
        q = re.sub(r"id: '.*?'", f"id: '{new_id}'", q)
        final_list.append(q)
        
    ts_out = "import { Question } from '../types';\n\n"
    ts_out += "export const questions2025: Question[] = [\n"
    ts_out += ",\n".join(final_list)
    ts_out += "\n];\n"
    
    with open('src/db/questions_2025.ts', 'w', encoding='utf-8') as f:
        f.write(ts_out)
        
    if os.path.exists('src/db/questions_2025_part2.ts'):
        os.remove('src/db/questions_2025_part2.ts')
        
    print(f"Successfully unified {len(final_list)} questions.")

if __name__ == "__main__":
    merge_and_fix()
