
import re

def analyze_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    item_regex = re.compile(r'^Item:\s*(\d+)')
    num_regex = re.compile(r'^(\d+)$')
    answer_regex = re.compile(r'Alternativa correta:\s*([A-E])', re.IGNORECASE)

    items_found = []
    answers_found = []
    naked_numbers = []

    for i, line in enumerate(lines):
        line = line.strip()
        
        m_item = item_regex.match(line)
        if m_item:
            items_found.append((int(m_item.group(1)), i + 1))
            
        m_num = num_regex.match(line)
        if m_num:
            # Check if next line starts with "De acordo" to confirm it's a question header
            if i + 1 < len(lines) and (lines[i+1].strip().startswith("De acordo") or lines[i+1].strip().startswith("Nardi")):
                naked_numbers.append((int(m_num.group(1)), i + 1))
                
        m_ans = answer_regex.search(line)
        if m_ans:
            answers_found.append((m_ans.group(1), i + 1))

    # Redirect print to file
    with open("analysis_result.txt", "w", encoding="utf-8") as out:
        import sys
        sys.stdout = out
        
        print(f"Total lines: {len(lines)}")
        print(f"Found {len(items_found)} 'Item: X' blocks.")
        if items_found:
            print(f"First Item: {items_found[0]}, Last Item: {items_found[-1]}")
        
        print(f"Found {len(naked_numbers)} 'N' blocks (potential commentary start).")
        if naked_numbers:
            print(f"First N: {naked_numbers[0]}, Last N: {naked_numbers[-1]}")
            print(f"Questions covered by N blocks: {[n[0] for n in naked_numbers]}")
            
        print(f"Found {len(answers_found)} answers.")
        if answers_found:
            print(f"First Answer at line {answers_found[0][1]}, Last Answer at line {answers_found[-1][1]}")
            
        # Check for "Gabarito"
        gabarito_regex = re.compile(r'Gabarito:\s*(\w)', re.IGNORECASE)
        gabaritos = []
        for i, line in enumerate(lines):
            m = gabarito_regex.search(line)
            if m:
                gabaritos.append((m.group(1), i+1))
        print(f"Found {len(gabaritos)} 'Gabarito' entries.")

if __name__ == "__main__":
    analyze_file(r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\extracted_questions.txt")
