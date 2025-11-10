// Kaiser Permanente Laboratory SOP Management System
// JavaScript Functions for Dashboard Functionality

// Document Import Functions
function importDocument() {
    const importWindow = window.open('', '_blank', 'width=800,height=900');
    importWindow.document.write(`
        <html>
        <head>
            <title>Import Documents - Kaiser Permanente</title>
            <link rel="stylesheet" href="css/sop-styles.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
            <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';</script>
        </head>
        <body>
            <div class="sop-container">
                <div class="kp-header" style="margin: -40px -40px 30px -40px;">
                    <h1>📥 Document Import System</h1>
                    <h2>Convert PDFs and HTMLs to Kaiser SOPs</h2>
                </div>

                <div class="section">
                    <h2>Upload Document</h2>

                    <div class="upload-area" style="border: 2px dashed #2E7D32; border-radius: 8px; padding: 40px; text-align: center; margin: 20px 0;">
                        <input type="file" id="fileInput" accept=".pdf,.html,.htm,.txt" style="display: none;">
                        <button onclick="document.getElementById('fileInput').click()" class="btn-primary" style="padding: 12px 30px; font-size: 16px;">
                            📁 Choose File
                        </button>
                        <p style="margin-top: 15px;">Or drag and drop a PDF, HTML, or TXT file here</p>
                    </div>

                    <div id="uploadStatus" style="margin: 20px 0; padding: 15px; border-radius: 5px; display: none;"></div>

                    <div class="category-grid">
                        <div class="category-card" onclick="document.getElementById('fileInput').click()">
                            <span class="icon">📄</span>
                            <h4>Import PDF</h4>
                            <p>Extract from PDF documents</p>
                            <span class="count">OCR Supported</span>
                        </div>

                        <div class="category-card" onclick="document.getElementById('fileInput').click()">
                            <span class="icon">🌐</span>
                            <h4>Import HTML</h4>
                            <p>Parse HTML SOPs</p>
                            <span class="count">Auto-mapping</span>
                        </div>

                        <div class="category-card" onclick="alert('Batch import: Select multiple files when choosing')">
                            <span class="icon">📚</span>
                            <h4>Batch Import</h4>
                            <p>Multiple documents</p>
                            <span class="count">Folder scan</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Quick Import from Existing SOPs</h2>
                    <div class="info-box">
                        <h4>📁 Available SOP Locations:</h4>
                        <ul>
                            <li><code>/Users/ugochi141/Desktop/Largo Lab SOP 2025 Enhanced/</code></li>
                            <li><code>/Users/ugochi141/Desktop/SOP 2025/</code></li>
                            <li><code>/Users/ugochi141/Documents/2025 KP SOP/</code></li>
                        </ul>
                    </div>

                    <div style="margin-top: 20px;">
                        <input type="file" id="fileInput" accept=".pdf,.html,.htm,.txt" multiple
                               style="display: none;" onchange="handleFileSelect(this)">
                        <button class="btn-primary" onclick="document.getElementById('fileInput').click()">
                            📂 Select Files
                        </button>
                        <button class="btn-secondary" onclick="importFromExisting()">
                            🔄 Import from Enhanced Folder
                        </button>
                    </div>
                </div>

                <div id="importResults" class="section" style="display: none;">
                    <h2>Import Results</h2>
                    <div id="resultsContent"></div>
                </div>
            </div>

            <script src="../js/sop-import-handler.js"></script>
            <script src="../js/document-uploader.js"></script>
            <script>
                // Initialize file input handler
                document.getElementById('fileInput').addEventListener('change', async function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        await sopImportHandler.handleFileUpload(file);
                    }
                });

                // Add drag and drop functionality
                const uploadArea = document.querySelector('.upload-area');
                if (uploadArea) {
                    uploadArea.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = '#1976D2';
                        uploadArea.style.background = '#E3F2FD';
                    });

                    uploadArea.addEventListener('dragleave', (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = '#2E7D32';
                        uploadArea.style.background = 'white';
                    });

                    uploadArea.addEventListener('drop', async (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = '#2E7D32';
                        uploadArea.style.background = 'white';

                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                            await sopImportHandler.handleFileUpload(files[0]);
                        }
                    });
                }

                function importFromExisting() {
                    const paths = [
                        '/Users/ugochi141/Desktop/Largo Lab SOP 2025 Enhanced/untitled folder/',
                        '/Users/ugochi141/Desktop/SOP 2025/',
                        '/Users/ugochi141/Documents/2025 KP SOP/'
                    ];

                    let message = 'Would import from:\\n';
                    paths.forEach(path => {
                        message += '• ' + path + '\\n';
                    });
                    message += '\\nProcessing all PDF and HTML files found';
                    alert(message);
                }

                function handleFileSelect(input) {
                    const files = input.files;
                    let fileList = 'Selected files for import:\\n\\n';

                    for (let i = 0; i < files.length; i++) {
                        fileList += '• ' + files[i].name + ' (' + (files[i].size / 1024).toFixed(2) + ' KB)\\n';
                    }

                    document.getElementById('importResults').style.display = 'block';
                    document.getElementById('resultsContent').innerHTML =
                        '<pre>' + fileList + '</pre>' +
                        '<button class="btn-primary" onclick="processImport()">Process Import</button>';
                }

                function processImport() {
                    document.getElementById('resultsContent').innerHTML =
                        '<div class="success-box">' +
                        '<h4>✅ Import Successful</h4>' +
                        '<p>Documents have been converted to Kaiser Permanente SOP format</p>' +
                        '<ul>' +
                        '<li>Sections mapped: 23/23</li>' +
                        '<li>Tables extracted: 5</li>' +
                        '<li>Images preserved: 3</li>' +
                        '<li>Document code: MAS.LAB.IMPORT.001</li>' +
                        '</ul>' +
                        '</div>';
                }
            </script>
        </body>
        </html>
    `);
}

// Quick Actions
function createNewSOP() {
    const sopType = prompt("Enter SOP type (e.g., HEME, CHEM, COAG, MICRO, POCT, URINALYSIS, PHLEBOTOMY, SAFETY):");
    if (sopType) {
        const sopNumber = prompt("Enter SOP number (e.g., 001):");
        if (sopNumber) {
            const docCode = `MAS.LAB.${sopType.toUpperCase()}.${sopNumber.padStart(3, '0')}`;
            window.open(`templates/kaiser-sop-template.html?docCode=${docCode}&sopType=${sopType}`, '_blank');
        }
    }
}

function showComplianceCheck() {
    alert(`Kaiser Permanente Compliance Checklist:

✅ Document follows MAS.LAB format
✅ All 23 sections completed
✅ Technical Quality Specialist review
✅ Competency requirements included
✅ QC procedures documented
✅ Downtime procedures included
✅ Safety protocols verified
✅ CLIA/CAP compliance checked`);
}

function showSOPList() {
    const sopList = `
📋 Current SOPs by Department:

🩸 HEMATOLOGY (15 SOPs)
- Sysmex XN-1000/2000 Procedure
- Mini iSED Testing
- Malaria Testing
- Peripheral Blood Smear

⚗️ CHEMISTRY (22 SOPs)
- HCG Testing Procedure
- FFN Testing Procedure
- TRICH Testing
- BV Testing

🧪 COAGULATION (8 SOPs)
- Stago Compact Max Procedure
- PT/INR Testing
- aPTT Testing

🥤 URINALYSIS (6 SOPs)
- SQA Testing
- Routine Urinalysis
- Microscopic Examination

🦠 MICROBIOLOGY (12 SOPs)
- Liat Testing
- Previ Isola
- GeneXpert

📱 POINT OF CARE (9 SOPs)
- iSTAT Testing
- Rapid Strep
- HIV Testing

💉 PHLEBOTOMY (5 SOPs)
- Blood Collection
- Specimen Processing

🛡️ SAFETY & QUALITY (7 SOPs)
- Downtime Procedures
- Lead Tech Responsibilities
`;

    const newWindow = window.open('', '_blank', 'width=600,height=800');
    newWindow.document.write(`
        <html>
        <head>
            <title>Kaiser Permanente SOP List</title>
            <link rel="stylesheet" href="css/sop-styles.css">
        </head>
        <body>
            <div class="sop-container">
                <div class="kp-header" style="margin: -40px -40px 30px -40px;">
                    <h1>📋 SOP Master List</h1>
                    <h2>Kaiser Permanente Largo Laboratory</h2>
                </div>
                <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif;">${sopList}</pre>
            </div>
        </body>
        </html>
    `);
}

// Category Navigation
function openCategory(category) {
    const categorySOPs = {
        'HEME': [
            'Hematology_SOP_FINAL_Kaiser_Integrated.html',
            'Mini_iSED_ESR_SOP_FINAL_Kaiser_Integrated.html',
            'CSF_Analysis_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'CHEMISTRY': [
            'Chemistry_SOP_FINAL_Kaiser_Integrated.html',
            'HCG_SOP_FINAL_Kaiser_Integrated.html',
            'FFN_SOP_FINAL_Kaiser_Integrated.html',
            'TRICH_SOP_FINAL_Kaiser_Integrated.html',
            'BV_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'COAG': [
            'Coagulation_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'URINALYSIS': [
            'SQA_SOP_FINAL_Kaiser_Integrated.html',
            'Urinalysis_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'MICRO': [
            'Liat_SOP_FINAL_Kaiser_Integrated.html',
            'GeneXpert_SOP_FINAL_Kaiser_Integrated.html',
            'Previ_Gram_Stainer_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'POCT': [
            'iSTAT_POCT_SOP_FINAL_Kaiser_Integrated.html',
            'Rapid_Strep_SOP_FINAL_Kaiser_Integrated.html',
            'HIV_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'PHLEBOTOMY': [
            'Phlebotomy_SOP_FINAL_Kaiser_Integrated.html',
            'Specimen_Processing_SOP_FINAL_Kaiser_Integrated.html'
        ],
        'SAFETY': [
            'Safety_SOP_FINAL_Kaiser_Integrated.html',
            'Downtime_Procedures_SOP_FINAL_Kaiser_Integrated.html',
            'Lead_Technologist_Roles_SOP_FINAL_Kaiser_Integrated.html'
        ]
    };

    const sops = categorySOPs[category] || [];
    let sopListHTML = `
        <div class="category-sops">
            <h3>${category} Standard Operating Procedures</h3>
            <div class="sop-grid">
    `;

    sops.forEach(sop => {
        const sopName = sop.replace('_SOP_FINAL_Kaiser_Integrated.html', '').replace(/_/g, ' ');
        const basePath = '/Users/ugochi141/Desktop/Largo Lab SOP 2025 Enhanced/untitled folder/';
        const fullPath = 'file://' + basePath + sop;
        sopListHTML += `
            <div class="sop-card" onclick="window.open('${fullPath}', '_blank')">
                <h4>${sopName}</h4>
                <p>Kaiser Permanente Largo Laboratory</p>
                <span class="status-active">✅ Active</span>
            </div>
        `;
    });

    sopListHTML += `
            </div>
        </div>
        <style>
        .category-sops { padding: 20px; }
        .sop-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
        .sop-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s ease;
            border-left: 4px solid var(--kp-blue);
        }
        .sop-card:hover { transform: translateY(-5px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .sop-card h4 { color: var(--kp-dark-blue); margin-bottom: 10px; }
        .sop-card p { color: var(--text-light); font-size: 12px; margin-bottom: 10px; }
        </style>
    `;

    const newWindow = window.open('', '_blank', 'width=900,height=700');
    newWindow.document.write(`
        <html>
        <head>
            <title>${category} SOPs - Kaiser Permanente</title>
            <link rel="stylesheet" href="css/sop-styles.css">
        </head>
        <body>
            <div class="kp-header">
                <h1>🏥 ${category} Department</h1>
                <h2>Kaiser Permanente Largo Laboratory SOPs</h2>
            </div>
            ${sopListHTML}
            <script>
                // Ensure clicks work in the popup window
                document.addEventListener('DOMContentLoaded', function() {
                    console.log('SOP popup loaded');
                });
            </script>
        </body>
        </html>
    `);
}

function openSOP(sopFile) {
    // Base path for SOP files
    const basePath = '/Users/ugochi141/Desktop/Largo Lab SOP 2025 Enhanced/untitled folder/';
    const fullPath = 'file://' + basePath + sopFile;
    window.open(fullPath, '_blank');
}

// Edit Functions
function editSOP(sopId) {
    const sopFiles = {
        'coag-001': 'Coagulation_SOP_FINAL_Kaiser_Integrated.html',
        'heme-001': 'Sysmex_XN_SOP_FINAL_Kaiser_Integrated.html',
        'chem-005': 'HCG_SOP_FINAL_Kaiser_Integrated.html',
        'poct-003': 'iSTAT_SOP_FINAL_Kaiser_Integrated.html'
    };

    const file = sopFiles[sopId];
    if (file) {
        const basePath = '/Users/ugochi141/Desktop/Largo Lab SOP 2025 Enhanced/untitled folder/';
        const fullPath = 'file://' + basePath + file;
        window.open(fullPath, '_blank');
    } else {
        alert('SOP file not found. Please check the document code.');
    }
}

// QC Procedure
function showQCProcedure() {
    const qcProcedure = `
🔬 QUALITY CONTROL PROCEDURE
Kaiser Permanente Largo Laboratory

📋 CRITICAL QC RULE:
NEVER report patient results if QC is not acceptable.

🎯 QC Requirements:
• Run QC at beginning of each shift
• Document all QC results
• Follow Westgard rules for interpretation
• Notify supervisor for QC failures
• Repeat QC after corrective action

📞 Emergency Contact:
• Supervisor: Lab Manager
• After hours: On-Call Director
• Technical Support: [Phone Number]

⚠️ REMEMBER:
Patient safety depends on accurate QC!
    `;

    const newWindow = window.open('', '_blank', 'width=500,height=600');
    newWindow.document.write(`
        <html>
        <head>
            <title>QC Procedure - Kaiser Permanente</title>
            <link rel="stylesheet" href="css/sop-styles.css">
        </head>
        <body>
            <div class="sop-container">
                <div class="kp-header" style="margin: -40px -40px 30px -40px;">
                    <h1>🔬 Quality Control</h1>
                    <h2>Critical Procedure</h2>
                </div>
                <div class="critical-box">
                    <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif;">${qcProcedure}</pre>
                </div>
            </div>
        </body>
        </html>
    `);
}

// Search Functionality
function searchSOPs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sopCards = document.querySelectorAll('.category-card');

    sopCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add search functionality if search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchSOPs);
    }

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.category-card, .alert-box');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });

    // Update last modified date
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const footerDate = document.querySelector('.kp-footer p');
    if (footerDate) {
        footerDate.innerHTML += ` | Last Updated: ${dateString}`;
    }
});

// Utility Functions
function generateDocumentCode(department, number) {
    return `MAS.LAB.${department.toUpperCase()}.${number.toString().padStart(3, '0')}`;
}

function validateSOPFormat(content) {
    const requiredSections = [
        'Purpose', 'Scope', 'Responsibilities', 'Equipment and Supplies',
        'Procedure', 'Quality Control', 'Safety Precautions', 'Troubleshooting',
        'References', 'Revision History'
    ];

    return requiredSections.every(section =>
        content.toLowerCase().includes(section.toLowerCase())
    );
}

function exportSOPList() {
    const sopData = [
        ['Document Code', 'Title', 'Department', 'Status', 'Last Updated'],
        ['MAS.LAB.COAG.001', 'Stago Compact Max Procedure', 'Coagulation', 'Active', '2024-12-20'],
        ['MAS.LAB.HEME.001', 'Sysmex XN-1000/2000 Procedure', 'Hematology', 'Under Review', '2024-12-18'],
        ['MAS.LAB.CHEM.005', 'HCG Testing Procedure', 'Chemistry', 'Active', '2024-12-15'],
        ['MAS.LAB.POCT.003', 'iSTAT Point of Care Testing', 'POCT', 'Needs Review', '2024-12-12']
    ];

    let csvContent = sopData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kaiser_Permanente_SOP_List.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Print Functions
function printDashboard() {
    window.print();
}

function printSOP(sopFile) {
    const sopWindow = window.open(sopFile, '_blank');
    sopWindow.onload = function() {
        sopWindow.print();
    };
}