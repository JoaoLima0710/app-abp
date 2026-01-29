
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

def fix_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix 'geral' theme - mapped to neurociencias_diagnostico which is a valid fallback
    content = content.replace("theme: 'geral'", "theme: 'neurociencias_diagnostico'")

    # 2. Fix fused options like A: "Distimia. B Hipomania."
    # Look for patterns like A: "something. B something else"
    def fix_fused_options(match):
        opt_a = match.group(1)
        opt_b = match.group(2)
        return f'            A: "{opt_a}",\n            B: "{opt_b}",'

    content = re.sub(r'A: "(.*?)\.?\s+B\s+(.*?)",', fix_fused_options, content)

    # 3. Ensure all questions have A, B, C, D, E. If missing, add placeholder.
    # This is trickier with regex, but we can try to find options blocks.
    def fix_missing_options(match):
        block = match.group(1)
        # Check for A, B, C, D, E keys
        for opt in ['A', 'B', 'C', 'D', 'E']:
            if f'{opt}:' not in block:
                # Add placeholder
                block = block.rstrip()
                if not block.endswith(','):
                    block += ','
                block += f'\n            {opt}: "Referência bibliográfica pendente.",'
        return f'options: {{{block}\n        }},'

    content = re.sub(r'options: \{(.*?)\},', fix_missing_options, content, flags=re.DOTALL)

    # 4. Final safety check on themes
    # (Already handled by step 1 mostly, but ensure 'geral' is gone)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")

if __name__ == "__main__":
    fix_file('src/db/questions_2025.ts')
    fix_file('src/db/questions_2025_part2.ts')
