
import re
import os

VALID_THEMES = [
    'transtornos_humor',
    'psicofarmacologia',
    'esquizofrenia_psicose',
    'psiquiatria_infantojuvenil',
    'urgencias_psiquiatricas',
    'psicoterapia',
    'etica_legal',
    'neurociencias_diagnostico',
    'transtornos_ansiedade',
    'transtornos_personalidade',
    'dependencia_quimica',
    'psiquiatria_geriatrica',
    'psiquiatria_forense',
    'saude_publica',
    'neurociencias',
    'psicogeriatria',
    'transtornos_alimentares'
]

def extract_questions(content):
    # Regex to find individual question objects
    # This is a bit rough but catches the structure
    pattern = r'\{\s+id:.*?\n\s+tags: \[.*?\]\s+\}'
    return re.findall(pattern, content, re.DOTALL)

def fix_question_object(q_str):
    # 1. Fix 'geral' theme
    q_str = q_str.replace("theme: 'geral'", "theme: 'neurociencias_diagnostico'")
    
    # 2. Fix fused options A and B
    q_str = re.sub(r'A: "(.*?)\.?\s+B\s+(.*?)",', r'A: "\1",\n            B: "\2",', q_str)
    
    # 3. Ensure A, B, C, D, E exist in options
    options_match = re.search(r'options: \{(.*?)\}', q_str, re.DOTALL)
    if options_match:
        opts_block = options_match.group(1)
        for letter in ['A', 'B', 'C', 'D', 'E']:
            if f'{letter}:' not in opts_block:
                opts_block = opts_block.rstrip()
                if not opts_block.endswith(','):
                    opts_block += ','
                opts_block += f'\n            {letter}: "Referência bibliográfica pendente.",'
        q_str = q_str.replace(options_match.group(0), f'options: {{{opts_block}\n        }}')
    
    return q_str

def main():
    q_files = ['src/db/questions_2025.ts', 'src/db/questions_2025_part2.ts']
    all_questions = []
    
    for fpath in q_files:
        if not os.path.exists(fpath): continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            qs = extract_questions(content)
            all_questions.extend(qs)
            
    # Dedup by normalizing the statement
    unique_qs = {}
    for q in all_questions:
        q = fix_question_object(q)
        # Extract statement for dedup
        stmt_match = re.search(r'statement: (.*?),', q, re.DOTALL)
        if stmt_match:
            stmt = stmt_match.group(1).strip().lower()
            if stmt not in unique_qs:
                unique_qs[stmt] = q
                
    sorted_qs = list(unique_qs.values())
    # Re-index IDs to be safe
    final_qs = []
    for i, q in enumerate(sorted_qs):
        new_id = f'p2025_{str(i+1).zfill(3)}'
        q = re.sub(r"id: '.*?'", f"id: '{new_id}'", q)
        final_qs.append(q)
        
    ts_content = "import { Question } from '../types';\n\n"
    ts_content += "export const questions2025: Question[] = [\n"
    ts_content += ",\n".join(final_qs)
    ts_content += "\n];\n"
    
    with open('src/db/questions_2025.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    if os.path.exists('src/db/questions_2025_part2.ts'):
        os.remove('src/db/questions_2025_part2.ts')
        
    print(f"Merged and fixed {len(final_qs)} questions into src/db/questions_2025.ts")

if __name__ == "__main__":
    main()
