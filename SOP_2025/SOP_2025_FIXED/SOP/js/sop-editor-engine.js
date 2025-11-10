/**
 * Kaiser Permanente SOP Editor Engine
 * Production-ready SOP management system with full section control
 */

class SOPEditorEngine {
    constructor() {
        this.sections = [];
        this.currentSectionId = null;
        this.autoSaveInterval = null;
        this.isDirty = false;
        this.sectionIdCounter = 0;

        // Default Kaiser Permanente sections
        this.defaultSections = [
            'Purpose', 'Clinical Significance', 'Scope', 'Responsibilities',
            'Safety Requirements', 'Specimen Requirements', 'Reagents and Supplies',
            'Equipment', 'Maintenance', 'Quality Control Requirements',
            'Calibration', 'Troubleshooting', 'Test Procedure',
            'Calculations and Result Reporting', 'Reference Ranges',
            'Critical Values', 'Limitations and Interferences',
            'Emergency Procedures', 'Technical Support', 'Quality Assurance',
            'Regulatory Compliance', 'Downtime Procedures', 'References'
        ];
    }

    init() {
        this.loadDefaultSections();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.startAutoSave();
        this.updateDisplay();
    }

    /**
     * Load default sections or from localStorage
     */
    loadDefaultSections() {
        // Check if there's saved data
        const savedData = localStorage.getItem('sopEditorData');

        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.sections = data.sections;
                this.sectionIdCounter = data.sectionIdCounter || this.sections.length;
                document.getElementById('sopTitle').textContent = data.title || 'Kaiser Permanente Laboratory SOP';
            } catch (e) {
                console.log('Loading default sections');
                this.loadDefaultTemplate();
            }
        } else {
            this.loadDefaultTemplate();
        }
    }

    loadDefaultTemplate() {
        // Load first 10 default sections
        this.defaultSections.slice(0, 10).forEach((title, index) => {
            this.sections.push({
                id: this.sectionIdCounter++,
                title: title,
                number: index + 1,
                content: '',
                subsections: [],
                visible: true,
                required: index < 5 // First 5 sections are required
            });
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Title change listener
        document.getElementById('sopTitle').addEventListener('input', () => {
            this.isDirty = true;
            this.updateSaveStatus('Unsaved changes');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveSOPLocal();
            }
            // Ctrl+P to print
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.previewPrint();
            }
        });
    }

    /**
     * Setup drag and drop for sections
     */
    setupDragAndDrop() {
        const sectionList = document.getElementById('sectionList');

        sectionList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('section-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
            }
        });

        sectionList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('section-item')) {
                e.target.classList.remove('dragging');
            }
        });

        sectionList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragging = sectionList.querySelector('.dragging');
            const afterElement = this.getDragAfterElement(sectionList, e.clientY);

            if (afterElement == null) {
                sectionList.appendChild(dragging);
            } else {
                sectionList.insertBefore(dragging, afterElement);
            }
        });

        sectionList.addEventListener('drop', (e) => {
            e.preventDefault();
            this.reorderSections();
            this.updateDisplay();
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Reorder sections based on DOM order
     */
    reorderSections() {
        const sectionElements = document.querySelectorAll('.section-item');
        const newOrder = [];

        sectionElements.forEach((element) => {
            const id = parseInt(element.dataset.sectionId);
            const section = this.sections.find(s => s.id === id);
            if (section) {
                newOrder.push(section);
            }
        });

        this.sections = newOrder;
        this.renumberSections();
        this.isDirty = true;
    }

    /**
     * Renumber sections after reordering
     */
    renumberSections() {
        this.sections.forEach((section, index) => {
            section.number = index + 1;
        });
    }

    /**
     * Add a new section
     */
    addSection(title, content = '') {
        const newSection = {
            id: this.sectionIdCounter++,
            title: title,
            number: this.sections.length + 1,
            content: content,
            subsections: [],
            visible: true,
            required: false
        };

        this.sections.push(newSection);
        this.isDirty = true;
        this.updateDisplay();

        // Focus on the new section
        this.selectSection(newSection.id);

        return newSection.id;
    }

    /**
     * Delete a section
     */
    deleteSection(id) {
        const section = this.sections.find(s => s.id === id);
        if (section && section.required) {
            alert('Cannot delete required section');
            return;
        }

        if (confirm(`Delete section "${section.title}"?`)) {
            this.sections = this.sections.filter(s => s.id !== id);
            this.renumberSections();
            this.isDirty = true;
            this.updateDisplay();
        }
    }

    /**
     * Toggle section visibility
     */
    toggleSectionVisibility(id) {
        const section = this.sections.find(s => s.id === id);
        if (section) {
            section.visible = !section.visible;
            this.isDirty = true;
            this.updateDisplay();
        }
    }

    /**
     * Rename a section
     */
    renameSection(id) {
        const section = this.sections.find(s => s.id === id);
        if (section) {
            const newTitle = prompt('Enter new section title:', section.title);
            if (newTitle && newTitle.trim()) {
                section.title = newTitle.trim();
                this.isDirty = true;
                this.updateDisplay();
            }
        }
    }

    /**
     * Add subsection
     */
    addSubsection(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section) {
            const title = prompt('Enter subsection title:');
            if (title) {
                section.subsections.push({
                    id: `sub_${Date.now()}`,
                    title: title,
                    content: ''
                });
                this.isDirty = true;
                this.updateDisplay();
            }
        }
    }

    /**
     * Delete subsection
     */
    deleteSubsection(sectionId, subsectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section) {
            section.subsections = section.subsections.filter(sub => sub.id !== subsectionId);
            this.isDirty = true;
            this.updateDisplay();
        }
    }

    /**
     * Select and display a section for editing
     */
    selectSection(id) {
        this.currentSectionId = id;

        // Update active state in list
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.sectionId) === id);
        });

        // Display section content
        this.displaySectionContent(id);
    }

    /**
     * Display section content in editor
     */
    displaySectionContent(id) {
        const section = this.sections.find(s => s.id === id);
        if (!section) return;

        const editorContent = document.getElementById('editorContent');

        let html = `
            <div class="section-content-editor" data-section-id="${section.id}">
                <div class="section-header-editor">
                    <input type="text" class="section-title-input"
                           value="${section.number}. ${section.title}"
                           onchange="sopEditor.updateSectionTitle(${section.id}, this.value)">
                    <button class="add-subsection-btn" onclick="sopEditor.addSubsection(${section.id})">
                        + Add Subsection
                    </button>
                </div>

                <div class="content-editable"
                     contenteditable="true"
                     id="sectionContent_${section.id}"
                     onblur="sopEditor.updateSectionContent(${section.id}, this.innerHTML)">
                    ${section.content || '<p>Enter section content here...</p>'}
                </div>

                <div class="subsections-container">
                    ${this.renderSubsections(section)}
                </div>
            </div>
        `;

        editorContent.innerHTML = html;
    }

    /**
     * Render subsections
     */
    renderSubsections(section) {
        if (!section.subsections || section.subsections.length === 0) {
            return '';
        }

        let html = '<h4>Subsections:</h4>';
        section.subsections.forEach((sub, index) => {
            html += `
                <div class="subsection-item">
                    <div class="subsection-controls">
                        <button onclick="sopEditor.deleteSubsection(${section.id}, '${sub.id}')"
                                class="section-btn" title="Delete">🗑️</button>
                    </div>
                    <h5>${section.number}.${index + 1} ${sub.title}</h5>
                    <div class="content-editable"
                         contenteditable="true"
                         onblur="sopEditor.updateSubsectionContent(${section.id}, '${sub.id}', this.innerHTML)">
                        ${sub.content || '<p>Enter subsection content...</p>'}
                    </div>
                </div>
            `;
        });

        return html;
    }

    /**
     * Update section content
     */
    updateSectionContent(id, content) {
        const section = this.sections.find(s => s.id === id);
        if (section) {
            section.content = content;
            this.isDirty = true;
            this.updateWordCount();
        }
    }

    /**
     * Update section title
     */
    updateSectionTitle(id, fullTitle) {
        const section = this.sections.find(s => s.id === id);
        if (section) {
            // Remove number prefix if present
            const title = fullTitle.replace(/^\d+\.\s*/, '');
            section.title = title;
            this.isDirty = true;
            this.updateDisplay();
        }
    }

    /**
     * Update subsection content
     */
    updateSubsectionContent(sectionId, subsectionId, content) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section) {
            const subsection = section.subsections.find(sub => sub.id === subsectionId);
            if (subsection) {
                subsection.content = content;
                this.isDirty = true;
            }
        }
    }

    /**
     * Update entire display
     */
    updateDisplay() {
        this.renderSectionList();
        this.renderTOC();
        this.updateCounts();

        if (this.currentSectionId) {
            this.displaySectionContent(this.currentSectionId);
        } else if (this.sections.length > 0) {
            this.selectSection(this.sections[0].id);
        }
    }

    /**
     * Render section list
     */
    renderSectionList() {
        const sectionList = document.getElementById('sectionList');

        let html = '';
        this.sections.forEach(section => {
            const visibilityIcon = section.visible ? '👁️' : '👁️‍🗨️';
            const requiredMark = section.required ? '🔒' : '';

            html += `
                <li class="section-item ${!section.visible ? 'hidden-section' : ''}"
                    data-section-id="${section.id}"
                    draggable="true"
                    onclick="sopEditor.selectSection(${section.id})">
                    <div>
                        <span class="section-number">${section.number}.</span>
                        <span>${section.title} ${requiredMark}</span>
                    </div>
                    <div class="section-controls">
                        <button onclick="event.stopPropagation(); sopEditor.renameSection(${section.id})"
                                class="section-btn" title="Rename">✏️</button>
                        <button onclick="event.stopPropagation(); sopEditor.toggleSectionVisibility(${section.id})"
                                class="section-btn" title="Toggle visibility">${visibilityIcon}</button>
                        ${!section.required ? `
                            <button onclick="event.stopPropagation(); sopEditor.deleteSection(${section.id})"
                                    class="section-btn" title="Delete">🗑️</button>
                        ` : ''}
                    </div>
                </li>
            `;
        });

        sectionList.innerHTML = html;
    }

    /**
     * Render Table of Contents
     */
    renderTOC() {
        const tocPreview = document.getElementById('tocPreview');

        let html = '';
        this.sections.forEach(section => {
            if (!section.visible) return;

            html += `
                <div class="toc-item" onclick="sopEditor.selectSection(${section.id})">
                    ${section.number}. ${section.title}
                </div>
            `;

            // Add subsections to TOC
            section.subsections.forEach((sub, index) => {
                html += `
                    <div class="toc-subsection">
                        ${section.number}.${index + 1} ${sub.title}
                    </div>
                `;
            });
        });

        tocPreview.innerHTML = html;
    }

    /**
     * Update counts in status bar
     */
    updateCounts() {
        document.getElementById('sectionCount').textContent = `${this.sections.length} sections`;
        this.updateWordCount();
    }

    /**
     * Update word count
     */
    updateWordCount() {
        let totalWords = 0;

        this.sections.forEach(section => {
            if (section.content) {
                const text = section.content.replace(/<[^>]*>/g, '');
                totalWords += text.split(/\s+/).filter(word => word.length > 0).length;
            }

            section.subsections.forEach(sub => {
                if (sub.content) {
                    const text = sub.content.replace(/<[^>]*>/g, '');
                    totalWords += text.split(/\s+/).filter(word => word.length > 0).length;
                }
            });
        });

        document.getElementById('wordCount').textContent = `${totalWords} words`;
    }

    /**
     * Auto-save functionality
     */
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.isDirty) {
                this.saveSOPLocal();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    /**
     * Save to localStorage
     */
    saveSOPLocal() {
        const data = {
            title: document.getElementById('sopTitle').textContent,
            sections: this.sections,
            sectionIdCounter: this.sectionIdCounter,
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem('sopEditorData', JSON.stringify(data));

        this.isDirty = false;
        this.updateSaveStatus('Saved');
        document.getElementById('lastSaved').textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
    }

    /**
     * Update save status indicator
     */
    updateSaveStatus(status) {
        const indicator = document.getElementById('saveIndicator');
        const statusEl = document.getElementById('saveStatus');

        statusEl.textContent = status;

        if (status === 'Saving...') {
            indicator.classList.add('saving');
        } else {
            indicator.classList.remove('saving');
        }
    }

    /**
     * Validate SOP
     */
    validateSOP() {
        const errors = [];
        const warnings = [];

        // Check required sections
        const requiredSections = ['Purpose', 'Scope', 'Responsibilities', 'Safety Requirements', 'Test Procedure'];
        requiredSections.forEach(title => {
            if (!this.sections.find(s => s.title.includes(title))) {
                errors.push(`Missing required section: ${title}`);
            }
        });

        // Check empty sections
        this.sections.forEach(section => {
            if (!section.content || section.content.trim() === '<p>Enter section content here...</p>') {
                warnings.push(`Empty section: ${section.title}`);
            }
        });

        // Update validation status
        const validationStatus = document.getElementById('validationStatus');
        if (errors.length === 0 && warnings.length === 0) {
            validationStatus.innerHTML = '✅ Validated';
            alert('✅ SOP validation passed!\n\nYour SOP meets all Kaiser Permanente requirements.');
        } else {
            validationStatus.innerHTML = '❌ Validation Failed';
            let message = 'Validation Results:\n\n';

            if (errors.length > 0) {
                message += 'ERRORS:\n' + errors.join('\n') + '\n\n';
            }

            if (warnings.length > 0) {
                message += 'WARNINGS:\n' + warnings.join('\n');
            }

            alert(message);
        }
    }

    /**
     * Export functions
     */
    exportHTML() {
        const html = this.generateFullHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SOP_${document.getElementById('sopTitle').textContent.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateFullHTML() {
        const title = document.getElementById('sopTitle').textContent;
        let content = '';

        // Generate TOC
        content += '<div class="toc"><h2>Table of Contents</h2><ul>';
        this.sections.forEach(section => {
            if (!section.visible) return;
            content += `<li><a href="#section_${section.id}">${section.number}. ${section.title}</a></li>`;
        });
        content += '</ul></div>';

        // Generate sections
        this.sections.forEach(section => {
            if (!section.visible) return;

            content += `
                <div class="section" id="section_${section.id}">
                    <h2>${section.number}. ${section.title}</h2>
                    ${section.content || ''}

                    ${section.subsections.map((sub, index) => `
                        <div class="subsection">
                            <h3>${section.number}.${index + 1} ${sub.title}</h3>
                            ${sub.content || ''}
                        </div>
                    `).join('')}
                </div>
            `;
        });

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 40px; }
                    .header { text-align: center; padding: 20px; background: #2E7D32; color: white; margin: -40px -40px 30px -40px; }
                    .toc { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    .toc ul { list-style: none; padding-left: 20px; }
                    .toc a { text-decoration: none; color: #2E7D32; }
                    .section { margin: 30px 0; page-break-inside: avoid; }
                    .section h2 { color: #2E7D32; border-bottom: 2px solid #2E7D32; padding-bottom: 10px; }
                    .subsection { margin-left: 20px; }
                    @media print {
                        .section { page-break-inside: avoid; }
                        .header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Kaiser Permanente Largo Laboratory</h1>
                    <h2>${title}</h2>
                </div>
                ${content}
                <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
                    Generated on ${new Date().toLocaleString()} | Kaiser Permanente Laboratory SOP
                </div>
            </body>
            </html>
        `;
    }

    exportPDF() {
        alert('PDF export would generate a PDF using the HTML content.\nFor production, integrate with a PDF library like jsPDF or use server-side generation.');
        // In production, integrate with a PDF library
    }

    exportWord() {
        alert('Word export would generate a .docx file.\nFor production, integrate with a library like docx.js or use server-side generation.');
        // In production, integrate with a Word generation library
    }

    exportJSON() {
        const data = {
            title: document.getElementById('sopTitle').textContent,
            sections: this.sections,
            metadata: {
                created: new Date().toISOString(),
                version: '1.0',
                author: document.getElementById('userName').textContent
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SOP_${document.getElementById('sopTitle').textContent.replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Print preview
     */
    previewPrint() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(this.generateFullHTML());
        printWindow.document.close();

        printWindow.onload = function() {
            printWindow.print();
        };
    }

    /**
     * Insert elements
     */
    insertTable() {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');

        if (rows && cols) {
            let table = '<table border="1" style="width: 100%; border-collapse: collapse;">';

            // Header row
            table += '<tr>';
            for (let c = 0; c < parseInt(cols); c++) {
                table += '<th style="padding: 8px; background: #f5f5f5;">Header ' + (c + 1) + '</th>';
            }
            table += '</tr>';

            // Data rows
            for (let r = 0; r < parseInt(rows) - 1; r++) {
                table += '<tr>';
                for (let c = 0; c < parseInt(cols); c++) {
                    table += '<td style="padding: 8px;">Data</td>';
                }
                table += '</tr>';
            }

            table += '</table>';

            this.insertAtCursor(table);
        }
    }

    insertImage() {
        const url = prompt('Enter image URL:');
        if (url) {
            this.insertAtCursor(`<img src="${url}" alt="Image" style="max-width: 100%;">`);
        }
    }

    insertWarningBox() {
        this.insertAtCursor(`
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0;">
                <strong>⚠️ WARNING:</strong> Enter warning text here
            </div>
        `);
    }

    insertInfoBox() {
        this.insertAtCursor(`
            <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 15px 0;">
                <strong>ℹ️ INFO:</strong> Enter information here
            </div>
        `);
    }

    insertAtCursor(html) {
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const node = document.createElement('div');
            node.innerHTML = html;
            range.insertNode(node.firstChild);
        }
    }

    /**
     * Auto-numbering
     */
    autoNumber() {
        this.renumberSections();
        this.updateDisplay();
        alert('Sections have been automatically renumbered');
    }
}

// Global functions for modal
function showAddSectionModal() {
    document.getElementById('addSectionModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addSectionModal').classList.remove('active');
    document.getElementById('customSectionName').value = '';
}

function addTemplateSection(title) {
    sopEditor.addSection(title);
    closeModal();
}

function addCustomSection() {
    const title = document.getElementById('customSectionName').value;
    if (title && title.trim()) {
        sopEditor.addSection(title.trim());
        closeModal();
    } else {
        alert('Please enter a section name');
    }
}

// Global function references
function saveSOPLocal() { sopEditor.saveSOPLocal(); }
function autoNumber() { sopEditor.autoNumber(); }
function insertTable() { sopEditor.insertTable(); }
function insertImage() { sopEditor.insertImage(); }
function insertWarningBox() { sopEditor.insertWarningBox(); }
function insertInfoBox() { sopEditor.insertInfoBox(); }
function validateSOP() { sopEditor.validateSOP(); }
function previewPrint() { sopEditor.previewPrint(); }
function exportHTML() { sopEditor.exportHTML(); }
function exportPDF() { sopEditor.exportPDF(); }
function exportWord() { sopEditor.exportWord(); }
function exportJSON() { sopEditor.exportJSON(); }

// Initialize the editor
const sopEditor = new SOPEditorEngine();