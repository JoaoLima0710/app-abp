
import json
import re

# Load exam trends to get valid themes and subthemes
import os

# Subtheme mapping based on keywords
SUBTHEME_MAPPING = {
    'lítio': 'Lítio e Estabilizadores',
    'fármaco': 'Psicofarmacologia Geral',
    'clozapina': 'Clozapina e Manejo de Riscos',
    'depressão': 'Depressão Resistente',
    'bipolar': 'Diagnóstico Diferencial TB x TDM',
    'esquizofrenia': 'Primeiro Episódio Psicótico',
    'infantil': 'TDAH ao Longo da Vida',
    'autismo': 'TEA (Autismo) em Adultos',
    'forense': 'Capacidade Civil e Interdição',
    'suicídio': 'Risco de Suicídio',
    'álcool': 'Alcoolismo',
    'idoso': 'Demências e Envelhecimento',
    'alzheimer': 'Demências e Envelhecimento',
    'ansiedade': 'Transtornos de Ansiedade',
    'pânico': 'Transtornos de Ansiedade'
}

def clean_questions():
    with open('ingested_2025_all.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Dedup and Clean
    unique_questions = {}
    for q in data:
        # Better normalization for dedup
        opts_str = "".join([v for k, v in sorted(q['options'].items())])
        norm = re.sub(r'\s+', ' ', q['statement'] + opts_str).strip().lower()
        
        if norm not in unique_questions or (not unique_questions[norm].get('has_answer') and q.get('has_answer')):
            unique_questions[norm] = q

    final_list = list(unique_questions.values())
    final_list.sort(key=lambda x: (x['tags'][0], x['id'])) # Sort by 2025_1/2 and original ID

    # Assign new IDs and Subthemes
    for i, q in enumerate(final_list):
        q['id'] = f'p2025_{str(i+1).zfill(3)}'
        
        # Refine subtheme
        stmt_lower = q['statement'].lower()
        for kw, sub in SUBTHEME_MAPPING.items():
            if kw in stmt_lower:
                q['subtheme'] = sub
                break
        
        # Fix statement prefixes (remove truncated bits like ",2)")
        q['statement'] = re.sub(r'^[^a-zA-Z0-9À-ÿ"\'(]+', '', q['statement'])

    # Write back to TS format
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
            for opt, val in sorted(q['options'].items()):
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

    ts_content = "import { Question } from '../types';\n\n"
    ts_content += "export const questions2025: Question[] = [\n"
    ts_content += to_ts(final_list)
    ts_content += "\n];\n"

    with open('src/db/questions_2025.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"Cleaned and saved {len(final_list)} questions to src/db/questions_2025.ts")

if __name__ == "__main__":
    clean_questions()
