
import re
import json

def sanitize_text(text):
    # Remove excessive newlines
    text = re.sub(r'\n+', ' ', text)
    # Remove Item: X
    text = re.sub(r'Item:\s*\d+', '', text)
    # Remove Página XXX
    text = re.sub(r'Página\s*\d+', '', text)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_questions(text):
    # Split by naked numbers at the start of a line that are followed by a newline or text
    blocks = re.split(r'\n(\d+)\n', text)
    
    questions_map = {}
    
    for i in range(1, len(blocks), 2):
        q_num = blocks[i]
        q_text = blocks[i+1]
        
        options_match = re.search(r'A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*E\)\s*(.*?)(\n|$)', q_text, re.DOTALL)
        if not options_match:
            options_match = re.search(r'A\s+(.*?)\s+B\s+(.*?)\s+C\s+(.*?)\s+D\s+(.*?)\s+E\s+(.*?)(\n|$)', q_text, re.DOTALL)
            
        if not options_match:
            continue
            
        options = {
            'A': sanitize_text(options_match.group(1)),
            'B': sanitize_text(options_match.group(2)),
            'C': sanitize_text(options_match.group(3)),
            'D': sanitize_text(options_match.group(4)),
            'E': sanitize_text(options_match.group(5))
        }
        
        # Statement is text before options
        statement_part = q_text[:options_match.start()].strip()
        # Take the longest part if it's repeated
        parts = re.split(r'\d+\n|Item:\s*\d+', statement_part)
        statement = sanitize_text(max(parts, key=len))
        
        # Answer and explanation
        after_options = q_text[options_match.end():].strip()
        
        patterns = [
            r'(?:Alternativa correta|Resposta|Resposta direta|Conclusão):\s*([A-E])',
            r'alternativa\s+correta\s+é\s*:?\s*([A-E])',
            r'Resposta\s*:?\s*([A-E])',
            r'(?:Portanto|Assim|Logo),?\s+.*?\s+é\s+:?\s*([A-E])',
            r'([A-E])\)\s+[\w\s]{3,}', # End with A) Text
            r'\b([A-E])\b\s+é\s+a\s+correta',
            r'\b([A-E])\b\s+corresponde\s+a'
        ]
        
        correct_answer = "A" # Default
        answer_found = False
        for p in patterns:
            match = re.search(p, after_options, re.IGNORECASE | re.MULTILINE)
            if match:
                correct_answer = match.group(1).upper()
                answer_found = True
                break
        
        if not answer_found:
             # Check if the explanation mentions "A alternativa correta é..." earlier
             match = re.search(r'correta\s+é\s*:?\s*([A-E])', q_text, re.IGNORECASE)
             if match:
                 correct_answer = match.group(1).upper()
                 answer_found = True
        
        explanation_text = sanitize_text(after_options.split('Página')[0])
        
        theme = 'geral'
        if 'TDAH' in q_text: theme = 'psiquiatria_infantojuvenil'
        elif 'DFT' in q_text or 'Alzheimer' in q_text or 'demência' in q_text.lower() or 'Parkinson' in q_text: theme = 'psicogeriatria'
        elif 'autismo' in q_text.lower() or 'TEA' in q_text: theme = 'psiquiatria_infantojuvenil'
        elif 'personalidade' in q_text.lower(): theme = 'transtornos_personalidade'
        elif 'esquizofrenia' in q_text.lower() or 'psicose' in q_text.lower(): theme = 'esquizofrenia_psicose'
        elif 'depressão' in q_text.lower() or 'bipolar' in q_text.lower() or 'Lítio' in q_text: theme = 'transtornos_humor'
        elif 'ansiedade' in q_text.lower() or 'pânico' in q_text.lower() or 'fobia' in q_text.lower(): theme = 'transtornos_ansiedade'
        elif 'isrs' in q_text.lower() or 'antidepressivo' in q_text.lower() or 'psicofarmacologia' in q_text.lower(): theme = 'psicofarmacologia'
        elif 'suicídio' in q_text.lower() or 'automutilação' in q_text.lower() or 'emergência' in q_text.lower(): theme = 'urgencias_psiquiatricas'
        elif 'forense' in q_text.lower() or 'jurídico' in q_text.lower() or 'ética' in q_text.lower(): theme = 'psiquiatria_forense'
        
        q_id = f'p2025_2_{q_num.zfill(3)}'
        
        # Deduplicate
        if q_id not in questions_map or (answer_found and not questions_map[q_id]['answer_found']):
            questions_map[q_id] = {
                'id': q_id,
                'theme': theme,
                'subtheme': 'Geral',
                'difficulty': 2,
                'statement': statement,
                'options': options,
                'correctAnswer': correct_answer,
                'explanation': {
                    'correct': explanation_text,
                    'keyConcepts': [theme],
                    'examTip': 'Consulte o Tratado da ABP (2022) para mais detalhes.'
                },
                'tags': ['2025', 'prova_2'],
                'answer_found': answer_found
            }
    
    return list(questions_map.values())

with open('extracted_questions.txt', 'r', encoding='utf-8') as f:
    full_text = f.read()
    start_marker = "Correção prova 2025.2"
    if start_marker in full_text:
        section_text = full_text.split(start_marker)[1]
        results = parse_questions(section_text)
        
        # Sort by ID
        results.sort(key=lambda x: x['id'])
        
        # Count found answers
        found_count = sum(1 for q in results if q['answer_found'])
        print(f"Extracted {len(results)} unique questions. Answers found for {found_count}.")
        
        # Clean up for JSON
        for q in results: del q['answer_found']

        with open('parsed_2025_2.json', 'w', encoding='utf-8') as fout:
            json.dump(results, fout, indent=2, ensure_ascii=False)
    else:
        print("Marker not found.")
