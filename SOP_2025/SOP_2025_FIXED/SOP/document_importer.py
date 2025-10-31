#!/usr/bin/env python3
"""
Kaiser Permanente SOP Document Importer
Extracts information from PDFs and HTML files to populate SOP templates
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
import PyPDF2
from pdfplumber import PDF
from bs4 import BeautifulSoup
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import pandas as pd
from werkzeug.utils import secure_filename

class DocumentImporter:
    """Advanced document import and extraction system for SOPs"""

    def __init__(self):
        self.supported_formats = ['.pdf', '.html', '.htm', '.txt', '.docx']
        self.extraction_patterns = {
            'procedure_name': [
                r'(?i)procedure\s*name\s*[:]\s*(.+)',
                r'(?i)title\s*[:]\s*(.+)',
                r'(?i)sop\s*[:]\s*(.+)'
            ],
            'department': [
                r'(?i)department\s*[:]\s*(.+)',
                r'(?i)laboratory\s*[:]\s*(.+)',
                r'(?i)section\s*[:]\s*(.+)'
            ],
            'equipment': [
                r'(?i)equipment\s*[:]\s*(.+)',
                r'(?i)instrument\s*[:]\s*(.+)',
                r'(?i)analyzer\s*[:]\s*(.+)'
            ],
            'specimen': [
                r'(?i)specimen\s*type\s*[:]\s*(.+)',
                r'(?i)sample\s*type\s*[:]\s*(.+)',
                r'(?i)collection\s*[:]\s*(.+)'
            ],
            'qc_requirements': [
                r'(?i)quality\s*control\s*[:]\s*(.+)',
                r'(?i)qc\s*[:]\s*(.+)',
                r'(?i)control\s*requirements\s*[:]\s*(.+)'
            ]
        }

    def extract_from_pdf(self, pdf_path):
        """Extract text and structured data from PDF files"""
        extracted_data = {
            'raw_text': '',
            'sections': {},
            'metadata': {},
            'images': []
        }

        try:
            # Try text extraction with pdfplumber first (better for tables)
            with PDF.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    # Extract text
                    text = page.extract_text()
                    if text:
                        extracted_data['raw_text'] += f"\n--- Page {page_num + 1} ---\n{text}"

                    # Extract tables
                    tables = page.extract_tables()
                    if tables:
                        for table_idx, table in enumerate(tables):
                            df = pd.DataFrame(table[1:], columns=table[0])
                            extracted_data['sections'][f'table_{page_num}_{table_idx}'] = df.to_dict()

            # Also use PyMuPDF for better image extraction
            pdf_document = fitz.open(pdf_path)

            for page_num in range(len(pdf_document)):
                page = pdf_document[page_num]

                # Extract images
                image_list = page.get_images()
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    pix = fitz.Pixmap(pdf_document, xref)
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_data = pix.tobytes("png")
                        extracted_data['images'].append({
                            'page': page_num + 1,
                            'index': img_index,
                            'data': img_data
                        })
                    pix = None

            pdf_document.close()

            # If no text was extracted, try OCR
            if not extracted_data['raw_text'].strip():
                extracted_data['raw_text'] = self.perform_ocr_on_pdf(pdf_path)

        except Exception as e:
            extracted_data['error'] = str(e)

        # Parse sections from extracted text
        extracted_data['sections'].update(self.parse_sections(extracted_data['raw_text']))

        return extracted_data

    def perform_ocr_on_pdf(self, pdf_path):
        """Perform OCR on scanned PDF pages"""
        ocr_text = ""

        try:
            pdf_document = fitz.open(pdf_path)

            for page_num in range(len(pdf_document)):
                page = pdf_document[page_num]

                # Convert page to image
                pix = page.get_pixmap(matrix=fitz.Matrix(300/72, 300/72))  # 300 DPI
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

                # Perform OCR
                page_text = pytesseract.image_to_string(img)
                ocr_text += f"\n--- Page {page_num + 1} (OCR) ---\n{page_text}"

            pdf_document.close()

        except Exception as e:
            ocr_text = f"OCR failed: {str(e)}"

        return ocr_text

    def extract_from_html(self, html_path):
        """Extract structured data from HTML files"""
        extracted_data = {
            'raw_text': '',
            'sections': {},
            'metadata': {},
            'tables': []
        }

        try:
            with open(html_path, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'html.parser')

                # Extract text
                extracted_data['raw_text'] = soup.get_text()

                # Extract metadata
                title_tag = soup.find('title')
                if title_tag:
                    extracted_data['metadata']['title'] = title_tag.string

                # Extract sections based on headers
                for header_tag in ['h1', 'h2', 'h3']:
                    headers = soup.find_all(header_tag)
                    for header in headers:
                        section_name = header.get_text().strip()
                        section_content = ""

                        # Get content after header until next header
                        for sibling in header.find_next_siblings():
                            if sibling.name and sibling.name.startswith('h'):
                                break
                            section_content += sibling.get_text() + "\n"

                        if section_content:
                            extracted_data['sections'][section_name] = section_content

                # Extract tables
                tables = soup.find_all('table')
                for table_idx, table in enumerate(tables):
                    # Convert HTML table to pandas DataFrame
                    df = pd.read_html(str(table))[0]
                    extracted_data['tables'].append({
                        'index': table_idx,
                        'data': df.to_dict()
                    })

                # Extract specific Kaiser Permanente elements
                kp_elements = self.extract_kp_specific_elements(soup)
                extracted_data['sections'].update(kp_elements)

        except Exception as e:
            extracted_data['error'] = str(e)

        return extracted_data

    def extract_kp_specific_elements(self, soup):
        """Extract Kaiser Permanente specific SOP elements from HTML"""
        kp_data = {}

        # Look for document code
        doc_code_patterns = [
            r'MAS\.LAB\.[A-Z]+\.\d{3}',
            r'Document\s*Code\s*[:]\s*([A-Z0-9\.\-]+)'
        ]

        for pattern in doc_code_patterns:
            match = re.search(pattern, soup.get_text())
            if match:
                kp_data['document_code'] = match.group(0)
                break

        # Look for critical values section
        critical_section = soup.find(text=re.compile(r'(?i)critical\s*values?'))
        if critical_section:
            parent = critical_section.find_parent()
            if parent:
                kp_data['critical_values'] = parent.get_text()

        # Look for QC requirements
        qc_section = soup.find(text=re.compile(r'(?i)quality\s*control'))
        if qc_section:
            parent = qc_section.find_parent()
            if parent:
                kp_data['quality_control'] = parent.get_text()

        # Extract competency requirements
        competency_patterns = [
            r'Document\s*14952_0',
            r'Document\s*13792_0'
        ]

        competency_refs = []
        for pattern in competency_patterns:
            if re.search(pattern, soup.get_text()):
                competency_refs.append(pattern)

        if competency_refs:
            kp_data['competency_requirements'] = competency_refs

        return kp_data

    def parse_sections(self, text):
        """Parse text into standard SOP sections"""
        sections = {}

        # Define section patterns
        section_patterns = {
            'purpose': r'(?i)(?:1\.?\s*)?purpose\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'scope': r'(?i)(?:2\.?\s*)?scope\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'responsibilities': r'(?i)(?:3\.?\s*)?responsibilities?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'equipment': r'(?i)(?:4\.?\s*)?equipment\s*(?:and\s*supplies)?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'specimen_requirements': r'(?i)(?:5\.?\s*)?specimen\s*requirements?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'safety': r'(?i)(?:6\.?\s*)?safety\s*(?:precautions?)?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'quality_control': r'(?i)(?:7\.?\s*)?quality\s*control\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'procedure': r'(?i)(?:9\.?\s*)?procedure\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'calculations': r'(?i)(?:10\.?\s*)?calculations?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'critical_values': r'(?i)(?:11\.?\s*)?critical\s*values?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'reference_ranges': r'(?i)(?:12\.?\s*)?reference\s*ranges?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'troubleshooting': r'(?i)(?:14\.?\s*)?troubleshooting\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'maintenance': r'(?i)(?:15\.?\s*)?maintenance\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'downtime': r'(?i)(?:19\.?\s*)?downtime\s*(?:procedures?)?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z])',
            'references': r'(?i)(?:22\.?\s*)?references?\s*[:]\s*(.*?)(?=\n(?:\d+\.?\s*)?[A-Z]|$)'
        }

        for section_name, pattern in section_patterns.items():
            match = re.search(pattern, text, re.DOTALL)
            if match:
                sections[section_name] = match.group(1).strip()

        return sections

    def extract_key_information(self, text):
        """Extract key information using pattern matching"""
        key_info = {}

        for field, patterns in self.extraction_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
                if match:
                    key_info[field] = match.group(1).strip()
                    break

        return key_info

    def merge_with_template(self, extracted_data, template_sections):
        """Merge extracted data with SOP template sections"""
        merged_data = template_sections.copy()

        # Map extracted sections to template sections
        section_mapping = {
            'purpose': 'purpose',
            'scope': 'scope',
            'responsibilities': 'responsibilities',
            'equipment': 'equipment',
            'specimen_requirements': 'specimen_requirements',
            'safety': 'safety_requirements',
            'quality_control': 'quality_control',
            'procedure': 'test_procedure',
            'calculations': 'calculations_reporting',
            'critical_values': 'critical_values',
            'reference_ranges': 'reference_ranges',
            'troubleshooting': 'troubleshooting',
            'maintenance': 'maintenance',
            'downtime': 'downtime_procedures',
            'references': 'references'
        }

        # Merge sections
        for extracted_key, template_key in section_mapping.items():
            if extracted_key in extracted_data.get('sections', {}):
                content = extracted_data['sections'][extracted_key]
                if content and template_key in merged_data:
                    # Append to existing content or replace if empty
                    if not merged_data[template_key]:
                        merged_data[template_key] = content
                    else:
                        merged_data[template_key] += f"\n\n--- Imported Content ---\n{content}"

        # Add key information
        key_info = extracted_data.get('key_info', {})
        if key_info:
            # Add to appropriate sections
            if 'procedure_name' in key_info and not merged_data.get('purpose'):
                merged_data['purpose'] = f"This SOP describes the procedure for {key_info['procedure_name']}"

            if 'equipment' in key_info:
                merged_data['equipment'] = key_info.get('equipment', '') + "\n" + merged_data.get('equipment', '')

        return merged_data

    def process_document(self, file_path):
        """Main method to process any supported document"""
        file_path = Path(file_path)

        if not file_path.exists():
            return {'error': 'File not found'}

        file_extension = file_path.suffix.lower()

        if file_extension not in self.supported_formats:
            return {'error': f'Unsupported format: {file_extension}'}

        # Extract data based on file type
        if file_extension == '.pdf':
            extracted_data = self.extract_from_pdf(file_path)
        elif file_extension in ['.html', '.htm']:
            extracted_data = self.extract_from_html(file_path)
        else:
            # For other formats, basic text extraction
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
                extracted_data = {
                    'raw_text': text,
                    'sections': self.parse_sections(text)
                }

        # Extract key information
        extracted_data['key_info'] = self.extract_key_information(extracted_data.get('raw_text', ''))

        # Add metadata
        extracted_data['metadata'].update({
            'filename': file_path.name,
            'file_type': file_extension,
            'processed_date': datetime.now().isoformat(),
            'file_size': file_path.stat().st_size
        })

        return extracted_data


class SOPImportManager:
    """Manager for importing and converting documents to SOPs"""

    def __init__(self, database):
        self.database = database
        self.importer = DocumentImporter()
        self.upload_folder = Path('uploads')
        self.upload_folder.mkdir(exist_ok=True)

    def import_to_sop(self, file_path, user_id, department):
        """Import a document and create a new SOP"""

        # Process the document
        extracted_data = self.importer.process_document(file_path)

        if 'error' in extracted_data:
            return {'success': False, 'error': extracted_data['error']}

        # Get default SOP template sections
        from app import SOPDocument
        default_sections = SOPDocument.get_default_sections()

        # Merge extracted data with template
        merged_sections = self.importer.merge_with_template(extracted_data, default_sections)

        # Generate document code
        from app import SOPManager
        doc_code = SOPManager.generate_document_code(department, 'imported')

        # Extract title from document or use filename
        title = extracted_data.get('metadata', {}).get('title')
        if not title:
            title = extracted_data.get('key_info', {}).get('procedure_name')
        if not title:
            title = f"Imported SOP - {Path(file_path).stem}"

        # Create new SOP document
        new_sop = SOPDocument(
            document_identifier=doc_code,
            procedure_title=title,
            laboratory_department=department,
            author_id=user_id,
            review_due_date=datetime.utcnow() + timedelta(days=365)
        )

        # Save sections data
        new_sop.save_sections_data(merged_sections)

        # Add import metadata
        import_metadata = {
            'imported_from': extracted_data['metadata']['filename'],
            'import_date': datetime.utcnow().isoformat(),
            'file_type': extracted_data['metadata']['file_type']
        }
        new_sop.import_metadata = json.dumps(import_metadata)

        # Save to database
        self.database.session.add(new_sop)
        self.database.session.commit()

        return {
            'success': True,
            'sop_id': new_sop.id,
            'document_code': doc_code,
            'title': title,
            'sections_imported': len([s for s in merged_sections.values() if s]),
            'metadata': extracted_data['metadata']
        }

    def batch_import(self, folder_path, user_id, department):
        """Import multiple documents from a folder"""
        folder_path = Path(folder_path)
        results = []

        if not folder_path.exists() or not folder_path.is_dir():
            return {'error': 'Invalid folder path'}

        # Process all supported files in folder
        for file_path in folder_path.iterdir():
            if file_path.suffix.lower() in self.importer.supported_formats:
                result = self.import_to_sop(file_path, user_id, department)
                result['filename'] = file_path.name
                results.append(result)

        return {
            'total_files': len(results),
            'successful': len([r for r in results if r.get('success')]),
            'failed': len([r for r in results if not r.get('success')]),
            'results': results
        }

# Add to requirements.txt for installation
requirements = """
PyPDF2==3.0.1
pdfplumber==0.10.3
pytesseract==0.3.10
Pillow==10.1.0
PyMuPDF==1.23.8
beautifulsoup4==4.12.2
pandas==2.1.4
python-docx==1.1.0
"""

if __name__ == '__main__':
    print("Document Importer Module")
    print("Supported formats:", DocumentImporter().supported_formats)
    print("\nTo use this module, install requirements:")
    print("pip install", ' '.join(requirements.strip().split('\n')))