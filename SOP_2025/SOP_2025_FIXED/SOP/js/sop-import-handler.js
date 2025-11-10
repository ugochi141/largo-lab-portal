/**
 * Kaiser Permanente SOP Import Handler
 * Handles file upload and processing for SOP creation
 */

class SOPImportHandler {
    constructor() {
        this.uploader = null;
        this.initializeUploader();
    }

    initializeUploader() {
        // Load the document uploader if available
        if (typeof SOPDocumentUploader !== 'undefined') {
            this.uploader = new SOPDocumentUploader();
        }
    }

    /**
     * Handle file selection and processing
     */
    async handleFileUpload(file) {
        try {
            // Show processing status
            this.showStatus('processing', `Processing ${file.name}...`);

            // Process the file based on type
            const fileType = file.name.toLowerCase().split('.').pop();
            let content = '';
            let sections = {};

            if (fileType === 'pdf') {
                sections = await this.processPDFFile(file);
            } else if (fileType === 'html' || fileType === 'htm') {
                sections = await this.processHTMLFile(file);
            } else if (fileType === 'txt') {
                sections = await this.processTextFile(file);
            } else {
                throw new Error('Unsupported file type. Please upload PDF, HTML, or TXT files.');
            }

            // Create SOP with extracted content
            this.createSOPFromSections(sections, file.name);

            this.showStatus('success', `Successfully imported ${file.name}`);

        } catch (error) {
            this.showStatus('error', `Error processing file: ${error.message}`);
        }
    }

    /**
     * Process PDF file
     */
    async processPDFFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    // Check if PDF.js is available
                    if (typeof pdfjsLib !== 'undefined') {
                        const pdf = await pdfjsLib.getDocument({data: e.target.result}).promise;
                        let fullText = '';

                        // Extract text from all pages
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            fullText += pageText + '\n';
                        }

                        // Parse into sections
                        const sections = this.parseTextIntoSections(fullText);
                        resolve(sections);
                    } else {
                        // Fallback to basic text extraction
                        const text = await this.extractBasicText(e.target.result);
                        const sections = this.parseTextIntoSections(text);
                        resolve(sections);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Process HTML file
     */
    async processHTMLFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(e.target.result, 'text/html');

                    // Extract sections from HTML structure
                    const sections = this.parseHTMLIntoSections(doc);
                    resolve(sections);
                } catch (error) {
                    reject(error);
                }
            };

            reader.readAsText(file);
        });
    }

    /**
     * Process text file
     */
    async processTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const sections = this.parseTextIntoSections(e.target.result);
                    resolve(sections);
                } catch (error) {
                    reject(error);
                }
            };

            reader.readAsText(file);
        });
    }

    /**
     * Parse text into Kaiser Permanente 23 sections
     */
    parseTextIntoSections(text) {
        const sections = {};
        const sectionNames = [
            'purpose', 'clinical_significance', 'scope', 'responsibilities',
            'safety_requirements', 'specimen_requirements', 'reagents_and_supplies',
            'equipment', 'maintenance', 'quality_control_requirements',
            'calibration', 'troubleshooting', 'test_procedure',
            'calculations_and_result_reporting', 'reference_ranges',
            'critical_values', 'limitations_and_interferences',
            'emergency_procedures', 'technical_support', 'quality_assurance',
            'regulatory_compliance', 'downtime_procedures', 'references'
        ];

        const sectionPatterns = {
            purpose: /(?:purpose|objective|aim|goal)/i,
            clinical_significance: /(?:clinical\s*significance|clinical\s*importance)/i,
            scope: /(?:scope|applicability|applies\s*to)/i,
            responsibilities: /(?:responsibilities|roles|duties)/i,
            safety_requirements: /(?:safety\s*requirements|safety\s*precautions|ppe)/i,
            specimen_requirements: /(?:specimen\s*requirements|sample\s*requirements)/i,
            reagents_and_supplies: /(?:reagents?\s*(?:and|&)?\s*supplies?|materials)/i,
            equipment: /(?:equipment|instrumentation|analyzer)/i,
            maintenance: /(?:maintenance|cleaning|service)/i,
            quality_control_requirements: /(?:quality\s*control|qc\s*requirements?)/i,
            calibration: /(?:calibration|calibrator)/i,
            troubleshooting: /(?:troubleshooting|problem\s*solving)/i,
            test_procedure: /(?:test\s*procedure|procedure|method)/i,
            calculations_and_result_reporting: /(?:calculations?|result\s*reporting)/i,
            reference_ranges: /(?:reference\s*ranges?|normal\s*values?)/i,
            critical_values: /(?:critical\s*values?|panic\s*values?)/i,
            limitations_and_interferences: /(?:limitations?|interferences?)/i,
            emergency_procedures: /(?:emergency|stat|urgent)/i,
            technical_support: /(?:technical\s*support|vendor\s*support)/i,
            quality_assurance: /(?:quality\s*assurance|qa|proficiency)/i,
            regulatory_compliance: /(?:regulatory|compliance|clia|cap)/i,
            downtime_procedures: /(?:downtime|backup|contingency)/i,
            references: /(?:references?|bibliography|citations?)/i
        };

        // Split text into lines
        const lines = text.split('\n');
        let currentSection = null;
        let currentContent = [];

        for (const line of lines) {
            // Check if this line starts a new section
            let foundSection = false;
            for (const [sectionKey, pattern] of Object.entries(sectionPatterns)) {
                if (pattern.test(line)) {
                    // Save previous section
                    if (currentSection && currentContent.length > 0) {
                        sections[currentSection] = currentContent.join('\n').trim();
                    }
                    // Start new section
                    currentSection = sectionKey;
                    currentContent = [];
                    foundSection = true;
                    break;
                }
            }

            // Add line to current section
            if (!foundSection && currentSection) {
                currentContent.push(line);
            } else if (!foundSection && !currentSection && line.trim()) {
                // If no section yet, add to purpose
                if (!sections.purpose) sections.purpose = '';
                sections.purpose += line + '\n';
            }
        }

        // Save last section
        if (currentSection && currentContent.length > 0) {
            sections[currentSection] = currentContent.join('\n').trim();
        }

        return sections;
    }

    /**
     * Parse HTML into sections
     */
    parseHTMLIntoSections(doc) {
        const sections = {};

        // Try to find sections by headers
        const headers = doc.querySelectorAll('h1, h2, h3, h4');
        let currentSection = null;
        let currentContent = [];

        const sectionMap = {
            'purpose': ['purpose', 'objective', 'aim'],
            'clinical_significance': ['clinical significance', 'clinical importance'],
            'scope': ['scope', 'applicability'],
            'responsibilities': ['responsibilities', 'roles'],
            'safety_requirements': ['safety', 'ppe', 'precautions'],
            'specimen_requirements': ['specimen', 'sample', 'collection'],
            'reagents_and_supplies': ['reagents', 'supplies', 'materials'],
            'equipment': ['equipment', 'instrumentation', 'analyzer'],
            'maintenance': ['maintenance', 'cleaning'],
            'quality_control_requirements': ['quality control', 'qc'],
            'calibration': ['calibration'],
            'troubleshooting': ['troubleshooting', 'problems'],
            'test_procedure': ['procedure', 'method', 'testing'],
            'calculations_and_result_reporting': ['calculations', 'results', 'reporting'],
            'reference_ranges': ['reference', 'normal', 'ranges'],
            'critical_values': ['critical', 'panic', 'alert'],
            'limitations_and_interferences': ['limitations', 'interferences'],
            'emergency_procedures': ['emergency', 'stat'],
            'technical_support': ['support', 'contact'],
            'quality_assurance': ['quality assurance', 'qa'],
            'regulatory_compliance': ['regulatory', 'compliance', 'clia', 'cap'],
            'downtime_procedures': ['downtime', 'backup'],
            'references': ['references', 'bibliography']
        };

        headers.forEach(header => {
            const headerText = header.textContent.toLowerCase();

            // Check if this header matches a section
            for (const [sectionKey, keywords] of Object.entries(sectionMap)) {
                if (keywords.some(keyword => headerText.includes(keyword))) {
                    currentSection = sectionKey;

                    // Get content after this header until next header
                    let nextElement = header.nextElementSibling;
                    let content = [];

                    while (nextElement && !['H1', 'H2', 'H3', 'H4'].includes(nextElement.tagName)) {
                        content.push(nextElement.textContent);
                        nextElement = nextElement.nextElementSibling;
                    }

                    sections[currentSection] = content.join('\n').trim();
                    break;
                }
            }
        });

        // If no sections found, try to get all text
        if (Object.keys(sections).length === 0) {
            sections.purpose = doc.body.textContent.trim();
        }

        return sections;
    }

    /**
     * Create SOP from extracted sections
     */
    createSOPFromSections(sections, filename) {
        // Open the enhanced template with the content
        const templateUrl = 'templates/kp-sop-enhanced-template.html';
        const sopWindow = window.open(templateUrl, '_blank');

        // Wait for window to load then populate
        sopWindow.addEventListener('load', () => {
            // Set title
            const titleElement = sopWindow.document.querySelector('.editable');
            if (titleElement) {
                titleElement.textContent = filename.replace(/\.[^/.]+$/, '');
            }

            // Populate sections
            for (const [sectionId, content] of Object.entries(sections)) {
                const sectionElement = sopWindow.document.getElementById(sectionId);
                if (sectionElement) {
                    const contentDiv = sectionElement.querySelector('.section-content');
                    if (contentDiv) {
                        contentDiv.innerHTML = `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
                    }
                }
            }

            // Show success message
            const message = sopWindow.document.createElement('div');
            message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 25px; border-radius: 5px; z-index: 10000;';
            message.textContent = '✅ Content imported successfully!';
            sopWindow.document.body.appendChild(message);

            setTimeout(() => message.remove(), 5000);
        });
    }

    /**
     * Show status message
     */
    showStatus(type, message) {
        const statusDiv = document.getElementById('uploadStatus');
        if (!statusDiv) return;

        statusDiv.style.display = 'block';

        if (type === 'processing') {
            statusDiv.style.background = '#2196F3';
            statusDiv.style.color = 'white';
            statusDiv.innerHTML = `⏳ ${message}`;
        } else if (type === 'success') {
            statusDiv.style.background = '#4CAF50';
            statusDiv.style.color = 'white';
            statusDiv.innerHTML = `✅ ${message}`;
        } else if (type === 'error') {
            statusDiv.style.background = '#f44336';
            statusDiv.style.color = 'white';
            statusDiv.innerHTML = `❌ ${message}`;
        }

        if (type !== 'processing') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Extract basic text (fallback)
     */
    async extractBasicText(data) {
        // Basic text extraction from binary data
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(data);

        // Clean up common PDF artifacts
        return text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
    }
}

// Initialize handler
const sopImportHandler = new SOPImportHandler();