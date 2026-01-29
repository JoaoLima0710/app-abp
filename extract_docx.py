
import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as zf:
            xml_content = zf.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        
        # Define the namespace map
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        text_content = []
        for p in tree.findall('.//w:p', namespaces):
            p_text = []
            for t in p.findall('.//w:t', namespaces):
                if t.text:
                    p_text.append(t.text)
            text_content.append(''.join(p_text))
            
        return '\n'.join(text_content)
        
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

if __name__ == "__main__":
    file_path = r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\Banco de dados\Prova 20251 e 2025 2.docx"
    output_path = r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\extracted_questions.txt"
    
    if os.path.exists(file_path):
        text = extract_text_from_docx(file_path)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully wrote to {output_path}")
    else:
        print(f"File not found: {file_path}")
