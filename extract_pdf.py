import PyPDF2
import json

def extract_pdf_text(pdf_path):
    """Extract text from a PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += f"\n\n--- Page {page_num + 1} ---\n"
                text += page.extract_text()
    except Exception as e:
        text = f"Error reading {pdf_path}: {str(e)}"
    return text

# Extract both reports
rapport1_text = extract_pdf_text("Rapport.pdf")
rapport2_text = extract_pdf_text("Rapport2.pdf")

# Save to text files for easy reading
with open("rapport1_extracted.txt", "w", encoding="utf-8") as f:
    f.write("=" * 80 + "\n")
    f.write("RAPPORT 1 - EXTRACTED CONTENT\n")
    f.write("=" * 80 + "\n")
    f.write(rapport1_text)

with open("rapport2_extracted.txt", "w", encoding="utf-8") as f:
    f.write("=" * 80 + "\n")
    f.write("RAPPORT 2 - EXTRACTED CONTENT\n")
    f.write("=" * 80 + "\n")
    f.write(rapport2_text)

print("✅ PDF extraction completed!")
print(f"Rapport 1: {len(rapport1_text)} characters extracted")
print(f"Rapport 2: {len(rapport2_text)} characters extracted")
print("\nFiles created:")
print("  - rapport1_extracted.txt")
print("  - rapport2_extracted.txt")
