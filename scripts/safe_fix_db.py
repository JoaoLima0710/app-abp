
import os
import re

def safe_fix(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        # 1. Fix 'geral' theme
        if "theme: 'geral'" in line:
            line = line.replace("'geral'", "'neurociencias_diagnostico'")
        
        # 2. Fix fused A/B options
        # A: "Distimia. B Hipomania."
        match = re.search(r'A: "(.*?)\.?\s+B\s+(.*?)",', line)
        if match:
            line = f'            A: "{match.group(1)}",\n            B: "{match.group(2)}",\n'
            
        new_lines.append(line)

    # 3. Post-process to ensure all questions have A-E
    # We'll do this question by question in the final string
    content = "".join(new_lines)
    
    # Simple blocks for questions
    blocks = re.split(r'(\s+id:.*?\n\s+tags:)', content)
    
    # blocks[0] is header
    # then [id_tags, rest_of_q, id_tags, rest_of_q, ...]
    if len(blocks) > 1:
        final_content = blocks[0]
        for i in range(1, len(blocks), 2):
            tag_block = blocks[i]
            rest_block = blocks[i+1]
            
            # Find options block
            options_match = re.search(r'options: \{(.*?)\}', rest_block, re.DOTALL)
            if options_match:
                opts = options_match.group(1)
                for letter in ['A', 'B', 'C', 'D', 'E']:
                    if f'{letter}:' not in opts:
                        opts = opts.rstrip()
                        if not opts.strip().endswith(','):
                            opts += ','
                        opts += f'\n            {letter}: "Referência bibliográfica pendente.",'
                rest_block = rest_block.replace(options_match.group(1), opts)
            
            final_content += tag_block + rest_block
        content = final_content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")

if __name__ == "__main__":
    safe_fix('src/db/questions_2025.ts')
    safe_fix('src/db/questions_2025_part2.ts')
