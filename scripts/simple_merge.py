
import os
import re

def fix_content(content):
    # 1. Fix 'geral' theme
    content = content.replace("theme: 'geral'", "theme: 'neurociencias_diagnostico'")
    
    # 2. Fix fused A/B options
    content = re.sub(r'A: "(.*?)\.?\s+B\s+(.*?)",', r'A: "\1",\n            B: "\2",', content)
    
    # 3. Add missing options placeholder if any
    # (Matches blocks between { and })
    def fix_opts(match):
        block = match.group(0)
        if "options: {" in block:
            opt_content = re.search(r'options: \{(.*?)\}', block, re.DOTALL).group(1)
            new_opt_content = opt_content
            for L in ['A', 'B', 'C', 'D', 'E']:
                if f'{L}:' not in new_opt_content:
                    new_opt_content = new_opt_content.rstrip()
                    if not new_opt_content.strip().endswith(','): new_opt_content += ','
                    new_opt_content += f'\n            {L}: "Referência bibliográfica pendente.",'
            block = block.replace(opt_content, new_opt_content)
        return block

    content = re.sub(r'\{\s+id:.*?\n\s+tags: \[.*?\]\s+\}', fix_opts, content, flags=re.DOTALL)
    return content

def main():
    f1 = 'src/db/questions_2025.ts'
    f2 = 'src/db/questions_2025_part2.ts'
    
    with open(f1, 'r', encoding='utf-8') as h1:
        c1 = h1.read()
    
    with open(f2, 'r', encoding='utf-8') as h2:
        c2 = h2.read()
        
    c1 = fix_content(c1)
    c2 = fix_content(c2)
    
    # Extract questions from c2 (everything between [ and ])
    q2_match = re.search(r'\[(.*)\]', c2, re.DOTALL)
    if q2_match:
        q2_content = q2_match.group(1).strip()
        # Append to c1 before the last ]
        c1 = c1.rstrip()
        if c1.endswith('];'):
            c1 = c1[:-2].rstrip()
        elif c1.endswith(']'):
            c1 = c1[:-1].rstrip()
            
        if not c1.endswith(','):
            c1 += ','
            
        c1 += "\n" + q2_content + "\n];\n"
        
    with open(f1, 'w', encoding='utf-8') as h1:
        h1.write(c1)
        
    if os.path.exists(f2):
        os.remove(f2)
        
    print("Done. Check count.")

if __name__ == "__main__":
    main()
