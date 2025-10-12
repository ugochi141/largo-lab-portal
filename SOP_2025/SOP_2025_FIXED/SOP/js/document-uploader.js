/**
 * Kaiser Permanente SOP Document Upload and Content Extraction System
 * Extracts content from PDFs and HTML files to populate SOP templates
 */

class SOPDocumentUploader {
    constructor() {
        this.sections = [
            'purpose',
            'clinical_significance',
            'scope',
            'responsibilities',
            'safety_requirements',
            'specimen_requirements',
            'reagents_and_supplies',
            'equipment',
            'maintenance',
            'quality_control_requirements',
            'calibration',
            'troubleshooting',
            'test_procedure',
            'calculations_and_result_reporting',
            'reference_ranges',
            'critical_values',
            'limitations_and_interferences',
            'emergency_procedures',
            'technical_support',
            'quality_assurance',
            'regulatory_compliance',
            'downtime_procedures',
            'references'
        ];

        this.sectionPatterns = {
            purpose: /(?:1\.?\s*)?(?:purpose|objective|aim|goal)/i,
            clinical_significance: /(?:2\.?\s*)?(?:clinical\s*significance|clinical\s*importance|clinical\s*relevance)/i,
            scope: /(?:3\.?\s*)?(?:scope|applicability|applies\s*to)/i,
            responsibilities: /(?:4\.?\s*)?(?:responsibilities|roles|duties)/i,
            safety_requirements: /(?:5\.?\s*)?(?:safety\s*requirements|safety\s*precautions|ppe|personal\s*protective)/i,
            specimen_requirements: /(?:6\.?\s*)?(?:specimen\s*requirements|sample\s*requirements|collection)/i,
            reagents_and_supplies: /(?:7\.?\s*)?(?:reagents?\s*(?:and|&)?\s*supplies?|materials)/i,
            equipment: /(?:8\.?\s*)?(?:equipment|instrumentation|analyzer)/i,
            maintenance: /(?:9\.?\s*)?(?:maintenance|cleaning|service)/i,
            quality_control_requirements: /(?:10\.?\s*)?(?:quality\s*control|qc\s*requirements?|controls?)/i,
            calibration: /(?:11\.?\s*)?(?:calibration|calibrator)/i,
            troubleshooting: /(?:12\.?\s*)?(?:troubleshooting|problem\s*solving|issues)/i,
            test_procedure: /(?:13\.?\s*)?(?:test\s*procedure|procedure|method|testing)/i,
            calculations_and_result_reporting: /(?:14\.?\s*)?(?:calculations?|result\s*reporting|reporting)/i,
            reference_ranges: /(?:15\.?\s*)?(?:reference\s*ranges?|normal\s*values?|expected\s*values?)/i,
            critical_values: /(?:16\.?\s*)?(?:critical\s*values?|panic\s*values?|alert\s*values?)/i,
            limitations_and_interferences: /(?:17\.?\s*)?(?:limitations?|interferences?|interfering\s*substances?)/i,
            emergency_procedures: /(?:18\.?\s*)?(?:emergency|stat|urgent)/i,
            technical_support: /(?:19\.?\s*)?(?:technical\s*support|vendor\s*support|service)/i,
            quality_assurance: /(?:20\.?\s*)?(?:quality\s*assurance|qa|proficiency)/i,
            regulatory_compliance: /(?:21\.?\s*)?(?:regulatory|compliance|clia|cap)/i,
            downtime_procedures: /(?:22\.?\s*)?(?:downtime|backup|contingency)/i,
            references: /(?:23\.?\s*)?(?:references?|bibliography|citations?)/i
        };
    }

    /**
     * Process uploaded file based on type
     */
    async processFile(file) {
        const fileType = file.name.toLowerCase().split('.').pop();

        if (fileType === 'pdf') {
            return await this.processPDF(file);
        } else if (fileType === 'html' || fileType === 'htm') {
            return await this.processHTML(file);
        } else if (fileType === 'txt') {
            return await this.processTXT(file);
        } else {
            throw new Error('Unsupported file type. Please upload PDF, HTML, or TXT files.');
        }
    }

    /**
     * Process PDF file (requires PDF.js library)
     */
    async processPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async function(e) {
                try {
                    // Check if PDF.js is loaded
                    if (typeof pdfjsLib === 'undefined') {
                        // Fallback: extract basic text
                        const text = await this.extractBasicPDFText(e.target.result);
                        const sections = this.parseTextIntoSections(text);
                        resolve({
                            success: true,
                            sections: sections,
                            rawText: text,
                            images: []
                        });
                        return;
                    }

                    // Use PDF.js for full extraction
                    const pdf = await pdfjsLib.getDocument({data: e.target.result}).promise;
                    let fullText = '';
                    const images = [];

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += `\n--- Page ${i} ---\n${pageText}`;

                        // Extract images (simplified)
                        const operators = await page.getOperatorList();
                        for (let j = 0; j < operators.fnArray.length; j++) {
                            if (operators.fnArray[j] === pdfjsLib.OPS.paintJpegXObject ||
                                operators.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
                                images.push({
                                    page: i,
                                    index: j
                                });
                            }
                        }
                    }

                    const sections = this.parseTextIntoSections(fullText);
                    resolve({
                        success: true,
                        sections: sections,
                        rawText: fullText,
                        images: images
                    });

                } catch (error) {
                    // Fallback to basic text extraction
                    const text = this.extractBasicPDFText(e.target.result);
                    const sections = this.parseTextIntoSections(text);
                    resolve({
                        success: true,
                        sections: sections,
                        rawText: text,
                        images: []
                    });
                }
            }.bind(this);

            reader.onerror = () => reject(new Error('Failed to read PDF file'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Extract basic text from PDF without PDF.js
     */
    extractBasicPDFText(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        let text = '';
        let inTextObject = false;

        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];

            // Look for text objects in PDF
            if (byte === 0x28) { // '(' character - start of text
                inTextObject = true;
                continue;
            }
            if (byte === 0x29) { // ')' character - end of text
                inTextObject = false;
                text += ' ';
                continue;
            }

            if (inTextObject && byte >= 0x20 && byte <= 0x7E) {
                text += String.fromCharCode(byte);
            }
        }

        // Clean up text
        text = text.replace(/\s+/g, ' ').trim();
        return text;
    }

    /**
     * Process HTML file
     */
    async processHTML(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(e.target.result, 'text/html');

                // Extract text content
                const text = doc.body ? doc.body.innerText : '';

                // Extract images
                const images = [];
                const imgElements = doc.querySelectorAll('img');
                imgElements.forEach((img, index) => {
                    images.push({
                        src: img.src,
                        alt: img.alt,
                        index: index
                    });
                });

                // Look for existing sections
                const sections = this.extractHTMLSections(doc);

                // If no sections found, parse text
                if (Object.keys(sections).length === 0) {
                    Object.assign(sections, this.parseTextIntoSections(text));
                }

                resolve({
                    success: true,
                    sections: sections,
                    rawText: text,
                    images: images
                });
            };

            reader.onerror = () => reject(new Error('Failed to read HTML file'));
            reader.readAsText(file);
        });
    }

    /**
     * Extract sections from HTML document structure
     */
    extractHTMLSections(doc) {
        const sections = {};

        // Look for sections by ID
        this.sections.forEach(sectionName => {
            const element = doc.getElementById(sectionName) ||
                           doc.querySelector(`[id*="${sectionName}"]`) ||
                           doc.querySelector(`[class*="${sectionName}"]`);

            if (element) {
                sections[sectionName] = element.innerText || element.textContent || '';
            }
        });

        // Look for sections by heading text
        const headings = doc.querySelectorAll('h1, h2, h3, h4');
        headings.forEach(heading => {
            const headingText = heading.innerText || heading.textContent || '';

            for (const [sectionName, pattern] of Object.entries(this.sectionPatterns)) {
                if (pattern.test(headingText)) {
                    // Get content after heading until next heading
                    let content = '';
                    let nextElement = heading.nextElementSibling;

                    while (nextElement && !['H1', 'H2', 'H3', 'H4'].includes(nextElement.tagName)) {
                        content += (nextElement.innerText || nextElement.textContent || '') + '\n';
                        nextElement = nextElement.nextElementSibling;
                    }

                    if (content) {
                        sections[sectionName] = content.trim();
                    }
                    break;
                }
            }
        });

        // Look for tables and extract them
        const tables = doc.querySelectorAll('table');
        tables.forEach(table => {
            const tableText = this.extractTableContent(table);

            // Try to identify which section the table belongs to
            const previousHeading = this.findPreviousHeading(table);
            if (previousHeading) {
                const headingText = previousHeading.innerText || previousHeading.textContent || '';

                for (const [sectionName, pattern] of Object.entries(this.sectionPatterns)) {
                    if (pattern.test(headingText)) {
                        sections[sectionName] = (sections[sectionName] || '') + '\n\n' + tableText;
                        break;
                    }
                }
            }
        });

        return sections;
    }

    /**
     * Extract table content as formatted text
     */
    extractTableContent(table) {
        let text = '';
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            const rowText = Array.from(cells).map(cell =>
                (cell.innerText || cell.textContent || '').trim()
            ).join(' | ');
            text += rowText + '\n';
        });

        return text;
    }

    /**
     * Find previous heading element
     */
    findPreviousHeading(element) {
        let prev = element.previousElementSibling;

        while (prev) {
            if (['H1', 'H2', 'H3', 'H4'].includes(prev.tagName)) {
                return prev;
            }
            prev = prev.previousElementSibling;
        }

        return null;
    }

    /**
     * Process plain text file
     */
    async processTXT(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target.result;
                const sections = this.parseTextIntoSections(text);

                resolve({
                    success: true,
                    sections: sections,
                    rawText: text,
                    images: []
                });
            };

            reader.onerror = () => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    /**
     * Parse text into sections using pattern matching
     */
    parseTextIntoSections(text) {
        const sections = {};
        const lines = text.split('\n');
        let currentSection = null;
        let currentContent = [];

        lines.forEach(line => {
            let foundSection = false;

            // Check if line matches any section pattern
            for (const [sectionName, pattern] of Object.entries(this.sectionPatterns)) {
                if (pattern.test(line)) {
                    // Save previous section
                    if (currentSection && currentContent.length > 0) {
                        sections[currentSection] = currentContent.join('\n').trim();
                    }

                    // Start new section
                    currentSection = sectionName;
                    currentContent = [];
                    foundSection = true;

                    // Add the line content after the section heading
                    const cleanedLine = line.replace(pattern, '').trim();
                    if (cleanedLine) {
                        currentContent.push(cleanedLine);
                    }
                    break;
                }
            }

            // If not a section heading, add to current section
            if (!foundSection && currentSection) {
                currentContent.push(line);
            }
        });

        // Save last section
        if (currentSection && currentContent.length > 0) {
            sections[currentSection] = currentContent.join('\n').trim();
        }

        // Extract key information if sections not found
        if (Object.keys(sections).length < 5) {
            this.extractKeyInformation(text, sections);
        }

        return sections;
    }

    /**
     * Extract key information from text
     */
    extractKeyInformation(text, sections) {
        // Look for equipment mentions
        const equipmentMatch = text.match(/(?:equipment|instrument|analyzer)[\s:]*([^\n]+)/i);
        if (equipmentMatch && !sections.equipment) {
            sections.equipment = equipmentMatch[1];
        }

        // Look for specimen information
        const specimenMatch = text.match(/(?:specimen|sample)[\s:]*([^\n]+)/i);
        if (specimenMatch && !sections.specimen_requirements) {
            sections.specimen_requirements = specimenMatch[1];
        }

        // Look for QC information
        const qcMatch = text.match(/(?:quality control|qc)[\s:]*([^\n]+(?:\n[^\n]+){0,3})/i);
        if (qcMatch && !sections.quality_control_requirements) {
            sections.quality_control_requirements = qcMatch[1];
        }

        // Look for critical values
        const criticalMatch = text.match(/(?:critical|panic|alert)\s*values?[\s:]*([^\n]+(?:\n[^\n]+){0,3})/i);
        if (criticalMatch && !sections.critical_values) {
            sections.critical_values = criticalMatch[1];
        }

        // Look for Kaiser specific elements
        const kaiserMatch = text.match(/(?:document\s*)?(?:14952_0|13792_0)/gi);
        if (kaiserMatch) {
            sections.regulatory_compliance = (sections.regulatory_compliance || '') +
                '\nKaiser Permanente Documents: ' + kaiserMatch.join(', ');
        }

        // Look for MOB Laboratory reference
        const mobMatch = text.match(/MOB\s*Laboratory|301-555-2000/i);
        if (mobMatch && !sections.downtime_procedures) {
            sections.downtime_procedures = 'Backup Location: MOB Laboratory (301-555-2000)';
        }
    }

    /**
     * Populate SOP template with extracted content
     */
    populateTemplate(extractedData) {
        const sections = extractedData.sections || {};
        let populatedCount = 0;

        for (const [sectionName, content] of Object.entries(sections)) {
            if (content) {
                const sectionId = sectionName.replace(/_/g, '-');
                const element = document.getElementById(sectionId);

                if (element) {
                    // Find editable content area in section
                    const editableArea = element.querySelector('.editable-content') || element;

                    if (editableArea) {
                        // Preserve any existing content
                        const existingContent = editableArea.innerHTML;

                        // Add new content
                        if (existingContent && existingContent.trim() !== '[Enter content]') {
                            editableArea.innerHTML = existingContent + '\n\n<hr>\n<strong>Imported Content:</strong>\n' + this.formatContent(content);
                        } else {
                            editableArea.innerHTML = this.formatContent(content);
                        }

                        populatedCount++;

                        // Mark optional sections as active if content added
                        if (element.classList.contains('optional-section')) {
                            element.classList.add('active');
                            const toggle = element.querySelector('.section-toggle');
                            if (toggle) {
                                toggle.textContent = 'Hide Section';
                            }
                        }
                    }
                }
            }
        }

        // Handle images if present
        if (extractedData.images && extractedData.images.length > 0) {
            this.handleImages(extractedData.images);
        }

        return {
            success: true,
            sectionsPopulated: populatedCount,
            totalSections: Object.keys(sections).length
        };
    }

    /**
     * Format content for display
     */
    formatContent(content) {
        // Convert line breaks to HTML
        content = content.replace(/\n/g, '<br>');

        // Convert bullet points
        content = content.replace(/^\s*[-•*]\s+/gm, '<li>');
        if (content.includes('<li>')) {
            content = '<ul>' + content + '</ul>';
            content = content.replace(/<br><li>/g, '</li><li>');
            content = content.replace(/<li>/g, '</li><li>');
            content = content.replace('<ul></li>', '<ul>');
            content = content.replace('</ul>', '</li></ul>');
        }

        // Highlight Kaiser references
        content = content.replace(/(14952_0|13792_0)/g, '<strong style="color: #0066cc;">$1</strong>');

        // Highlight critical QC rule
        content = content.replace(/(NEVER report patient results if QC is not acceptable)/gi,
            '<strong style="color: red;">$1</strong>');

        return content;
    }

    /**
     * Handle extracted images
     */
    handleImages(images) {
        // Add images to appropriate sections
        images.forEach((image, index) => {
            if (image.src && image.src.startsWith('data:')) {
                // Find equipment or procedure image containers
                const equipmentImg = document.getElementById('equipment-img');
                const procedureImg = document.getElementById('procedure-img');

                if (index === 0 && equipmentImg) {
                    equipmentImg.src = image.src;
                    equipmentImg.style.display = 'block';
                } else if (index === 1 && procedureImg) {
                    procedureImg.src = image.src;
                    procedureImg.style.display = 'block';
                }
            }
        });
    }
}

// Initialize uploader and attach to window for global access
window.SOPUploader = new SOPDocumentUploader();

// Function to handle file upload
window.handleSOPUpload = async function(input) {
    const file = input.files[0];
    if (!file) return;

    const statusDiv = document.getElementById('upload-status') || createStatusDiv();
    statusDiv.innerHTML = '<p style="color: #0066cc;">⏳ Processing document...</p>';

    try {
        // Process file
        const result = await window.SOPUploader.processFile(file);

        // Populate template
        const populateResult = window.SOPUploader.populateTemplate(result);

        // Show success message
        statusDiv.innerHTML = `
            <div style="background: #d4edda; border: 1px solid #28a745; padding: 10px; border-radius: 4px;">
                <strong>✅ Upload Successful!</strong><br>
                Populated ${populateResult.sectionsPopulated} of ${populateResult.totalSections} sections detected.<br>
                <small>Review and edit the imported content as needed.</small>
            </div>
        `;

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);

    } catch (error) {
        statusDiv.innerHTML = `
            <div style="background: #f8d7da; border: 1px solid #dc3545; padding: 10px; border-radius: 4px;">
                <strong>❌ Upload Error:</strong><br>
                ${error.message}
            </div>
        `;
    }
};

// Create status div if it doesn't exist
function createStatusDiv() {
    const div = document.createElement('div');
    div.id = 'upload-status';
    div.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 1000; max-width: 400px;';
    document.body.appendChild(div);
    return div;
}

// Add PDF.js library dynamically if not present
if (typeof pdfjsLib === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    document.head.appendChild(script);

    script.onload = () => {
        // Configure PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    };
}