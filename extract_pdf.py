import os
from pypdf import PdfReader

base_path = r"C:\Users\Joao\Desktop\APP Prova de titulo ABP\Banco de dados\temasdasprovasabp2017a202320172022_pdf"
file_name = "TEMAS DAS PROVAS ABP - 2017 A 2023 - 2017-2022.pdf"
file_path = os.path.join(base_path, file_name)

try:
    reader = PdfReader(file_path)
    # Extract text from the first 10 pages to understand structure
    text = ""
    for i in range(min(10, len(reader.pages))):
        text += reader.pages[i].extract_text() + "\n\n--- PAGE BREAK ---\n\n"
    
    print(text.encode('utf-8', errors='ignore').decode('utf-8'))
except Exception as e:
    print(f"Error reading PDF: {e}")
