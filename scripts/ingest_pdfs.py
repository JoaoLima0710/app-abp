
import fitz  # PyMuPDF
import re
import json
import os

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def sanitize_text(text):
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()




def parse_questions_from_text(text, source_tag):
    # Pre-clean
    text = re.sub(r'Página \d+ de \d+', '', text)
    
    # Identify question starts using a very flexible pattern
    # 1. Look for Item: X
    # 2. Look for naked numbers at start of line
    # 3. Look for "De acordo" if it's the very start of the doc
    
    # We'll normalize the text slightly to avoid whitespace issues
    text = text.replace('\r\n', '\n')
    
    start_pattern = r'(?:\n|^)(?:Item:\s*)?(\d+)?(?:\s+)?(?:\n|\s+)?(?=De acordo|Assinale|Em relation|Sobre|O |A |Na |Nos |Qual |Quanto|De |Em 1892|Arnold Pick|Kraepelin)'
    
    # If the text starts with "De acordo", we might be missing Question 1
    if text.strip().startswith('De acordo'):
        # Insert a dummy "1 " at the start to catch it
        text = "1 " + text
        
    matches = list(re.finditer(r'(?:\n|^)(?:Item:\s*)?(\d+)', text))
    print(f"  Debug: Found {len(matches)} potential question markers.")
    
    questions = []
    for i in range(len(matches)):
        q_num = matches[i].group(1)
        if not q_num or (int(q_num) > 150 and "Item:" not in matches[i].group(0)):
            continue
            
        start_pos = matches[i].start()
        end_pos = matches[i+1].start() if i + 1 < len(matches) else len(text)
        block = text[start_pos:end_pos].strip()
        
        # Options
        options = {}
        # Find all option positions
        opt_matches = list(re.finditer(r'(?:\s|^|\n)([A-E])[.)]\s+', block))
        for j in range(len(opt_matches)):
            letter = opt_matches[j].group(1)
            start_idx = opt_matches[j].end()
            end_idx = opt_matches[j+1].start() if j + 1 < len(opt_matches) else len(block)
            
            # If there's an answer marker in between, cut it
            text_part = block[start_idx:end_idx]
            answer_marker = re.search(r'(?:Alternativa correta|Resposta|Resposta direta|Conclusão|Gabarito|Justificativa|Explicação|Página)', text_part, re.IGNORECASE)
            if answer_marker:
                text_part = text_part[:answer_marker.start()]
                
            options[letter] = sanitize_text(text_part)
        
        if len(options) < 4:
            continue
            
        # Statement
        # Find where option A starts
        if opt_matches and opt_matches[0].group(1) == 'A':
            statement_part = block[:opt_matches[0].start()].strip()
            # Be very careful removing the number - only remove if it's at the very start
            statement = sanitize_text(re.sub(rf'^(?:Item:\s*)?{q_num}\b\s*', '', statement_part))
            if not statement or len(statement) < 5:
                # Fallback: maybe the number was actually part of the text
                statement = sanitize_text(statement_part)
        else:
            continue
            
        # Answer detection
        # Create a specific search area after the last option
        last_opt_end = opt_matches[-1].end() + len(options.get(opt_matches[-1].group(1), ""))
        after_options = block[last_opt_end:].strip()
        
        answer_patterns = [
            r'(?:Alternativa correta|Resposta|Resposta direta|Conclusão|Gabarito|Alternativa|Correta)[:.\s\-]+([A-E])\b',
            r'alternativa\s+correta\s+é\s*[:.\s\-]*([A-E])',
            r'\b([A-E])\b\s+é\s+a\s+correta',
            r'\b([A-E])\b\s+corresponde\s+a',
            r'Resposta[:.\s\-]*\n?\s*([A-E])\b',
            r'\(?([A-E])\)?\s+–\s+[\w\s]{2,}',
            r'\n([A-E])\)\s+[\w\s]{3,}',
            r'correta\s+é\s+([A-E])',
            r'Alternativa[:.\s\-]*([A-E])'
        ]
        
        correct_answer = None
        has_answer = False
        # Search in the whole block but prioritize the end
        for p in answer_patterns:
            match = re.search(p, after_options, re.IGNORECASE | re.MULTILINE)
            if not match:
                match = re.search(p, block, re.IGNORECASE | re.MULTILINE)
            if match:
                correct_answer = match.group(1).upper()
                has_answer = True
                break
        
        if not correct_answer:
            correct_answer = "A" # Default
            if i % 10 == 0: # Print some debug info every 10 blocks
                print(f"  Debug: No answer found for Q{q_num}. Sample: {block[-200:].strip()}")
            
        # Explanation
        expl_pattern = r'(?:Explicação|Justificativa|Comentário|Justificativa objetiva|Página \d+)(.*?)(?=$)'
        explanation_match = re.search(expl_pattern, block, re.DOTALL | re.IGNORECASE)
        explanation_text = sanitize_text(explanation_match.group(1)) if explanation_match else "Gabarito baseado no comentário oficial."
        
        theme = 'geral'
        q_full = block.lower()
        if 'infantil' in q_full or 'adolescente' in q_full or 'tdah' in q_full: theme = 'psiquiatria_infantojuvenil'
        elif 'idoso' in q_full or 'geriatria' in q_full or 'alzheimer' in q_full or 'demência' in q_full: theme = 'psicogeriatria'
        elif 'forense' in q_full or 'legal' in q_full: theme = 'psiquiatria_forense'
        elif 'clozapina' in q_full or 'lítio' in q_full or 'farmaco' in q_full: theme = 'psicofarmacologia'
        elif 'esquizofrenia' in q_full or 'psicose' in q_full: theme = 'esquizofrenia_psicose'
        elif 'humor' in q_full or 'depressão' in q_full or 'bipolar' in q_full: theme = 'transtornos_humor'
        elif 'ansiedade' in q_full or 'pânico' in q_full: theme = 'transtornos_ansiedade'
        elif 'personalidade' in q_full: theme = 'transtornos_personalidade'
        
        questions.append({
            'id': f'p_{source_tag}_{q_num.zfill(3)}',
            'theme': theme,
            'subtheme': 'Geral',
            'difficulty': 2,
            'statement': statement,
            'options': options,
            'correctAnswer': correct_answer,
            'explanation': {
                'correct': explanation_text,
                'keyConcepts': [theme],
                'examTip': 'Verifique o Tratado da ABP.'
            },
            'tags': [source_tag, 'pdf_ingestion'],
            'has_answer': has_answer
        })
    return questions

def ingest_pdfs(folder_path):
    all_questions = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf") and "2025" in filename:
            print(f"Processing {filename}...")
            tag = "2025_1" if "2025.1" in filename else "2025_2"
            text = extract_text_from_pdf(os.path.join(folder_path, filename))
            questions = parse_questions_from_text(text, tag)
            all_questions.extend(questions)
            print(f"  Found {len(questions)} questions.")
            
    with open('ingested_2025_all.json', 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    db_folder = r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\Banco de dados"
    ingest_pdfs(db_folder)
