// Inventory Management System with Automated Email Ordering

// Initialize inventory system
document.addEventListener('DOMContentLoaded', function() {
    loadInventoryData();
    setupEventListeners();
    checkCriticalItems();
    updateOrderDate();
    loadAutoOrderSettings();
    startInventoryMonitoring();
});

// Complete inventory data based on provided Excel files
const inventoryDatabase = {
    chemistry: [
        { itemNumber: 'RCHEM001', description: 'ALT/GPT Reagent', analyzer: 'Roche Pure', current: 12, par: 20, unit: 'box', price: 245.50 },
        { itemNumber: 'RCHEM002', description: 'AST/GOT Reagent', analyzer: 'Roche Pure', current: 8, par: 20, unit: 'box', price: 245.50 },
        { itemNumber: 'RCHEM003', description: 'Glucose Reagent', analyzer: 'Roche Pure', current: 15, par: 25, unit: 'box', price: 189.00 },
        { itemNumber: 'RCHEM004', description: 'Creatinine Reagent', analyzer: 'Roche Pure', current: 5, par: 15, unit: 'box', price: 312.00 },
        { itemNumber: 'RCHEM005', description: 'BUN/Urea Reagent', analyzer: 'Roche Pure', current: 18, par: 20, unit: 'box', price: 198.75 },
        { itemNumber: 'RCHEM006', description: 'Troponin I', analyzer: 'Roche Pure', current: 3, par: 10, unit: 'kit', price: 892.50 },
        { itemNumber: 'RCHEM007', description: 'BNP Test Kit', analyzer: 'Roche Pure', current: 2, par: 8, unit: 'kit', price: 1250.00 },
        { itemNumber: 'RCHEM008', description: 'ISE Buffer Solution', analyzer: 'Roche Pure', current: 10, par: 12, unit: 'bottle', price: 78.50 },
        { itemNumber: 'RCHEM009', description: 'System Cleaner', analyzer: 'Roche Pure', current: 8, par: 10, unit: 'bottle', price: 45.00 },
        { itemNumber: 'RCHEM010', description: 'QC Level 1', analyzer: 'Roche Pure', current: 4, par: 8, unit: 'box', price: 325.00 }
    ],
    hematology: [
        { itemNumber: 'SYS001', description: 'XN-Check Level 1', analyzer: 'Sysmex XN-2000', current: 6, par: 12, unit: 'box', price: 485.00 },
        { itemNumber: 'SYS002', description: 'XN-Check Level 2', analyzer: 'Sysmex XN-2000', current: 5, par: 12, unit: 'box', price: 485.00 },
        { itemNumber: 'SYS003', description: 'XN-Check Level 3', analyzer: 'Sysmex XN-2000', current: 4, par: 12, unit: 'box', price: 485.00 },
        { itemNumber: 'SYS004', description: 'Cellpack DCL', analyzer: 'Sysmex XN-2000', current: 8, par: 20, unit: 'box', price: 125.00 },
        { itemNumber: 'SYS005', description: 'Lysercell WDF', analyzer: 'Sysmex XN-2000', current: 3, par: 10, unit: 'bottle', price: 298.00 },
        { itemNumber: 'SYS006', description: 'Fluorocell WNR', analyzer: 'Sysmex XN-2000', current: 2, par: 8, unit: 'bottle', price: 445.00 },
        { itemNumber: 'SYS007', description: 'Sulfolyser', analyzer: 'Sysmex XN-2000', current: 10, par: 15, unit: 'bottle', price: 89.50 },
        { itemNumber: 'STAG001', description: 'STA-Liquid Fib', analyzer: 'Stago Compact Max', current: 4, par: 10, unit: 'kit', price: 678.00 },
        { itemNumber: 'STAG002', description: 'STA-PTT-A', analyzer: 'Stago Compact Max', current: 3, par: 8, unit: 'kit', price: 445.00 },
        { itemNumber: 'STAG003', description: 'STA-Neoplastine CI Plus', analyzer: 'Stago Compact Max', current: 5, par: 10, unit: 'kit', price: 523.00 }
    ],
    urinalysis: [
        { itemNumber: 'CLIN001', description: 'Multistix 10 SG', analyzer: 'Clinitek Novus', current: 15, par: 30, unit: 'bottle', price: 125.50 },
        { itemNumber: 'CLIN002', description: 'Clinitek Control', analyzer: 'Clinitek Novus', current: 8, par: 12, unit: 'box', price: 189.00 },
        { itemNumber: 'UF001', description: 'UF-5000 Sheath', analyzer: 'Sysmex UF-5000', current: 6, par: 10, unit: 'box', price: 245.00 },
        { itemNumber: 'UF002', description: 'UF-5000 Pack', analyzer: 'Sysmex UF-5000', current: 4, par: 8, unit: 'box', price: 312.00 },
        { itemNumber: 'URIN001', description: 'Urine Cups 4oz', analyzer: 'Manual', current: 500, par: 2000, unit: 'case', price: 45.00 },
        { itemNumber: 'URIN002', description: 'Urine Transfer Tubes', analyzer: 'Manual', current: 200, par: 1000, unit: 'box', price: 28.50 },
        { itemNumber: 'URIN003', description: 'Pregnancy Test Kits', analyzer: 'Manual', current: 20, par: 50, unit: 'box', price: 125.00 }
    ],
    coagulation: [
        { itemNumber: 'COAG001', description: 'PT Reagent', analyzer: 'Stago Compact Max', current: 8, par: 15, unit: 'kit', price: 523.00 },
        { itemNumber: 'COAG002', description: 'APTT Reagent', analyzer: 'Stago Compact Max', current: 6, par: 12, unit: 'kit', price: 445.00 },
        { itemNumber: 'COAG003', description: 'Fibrinogen Reagent', analyzer: 'Stago Compact Max', current: 3, par: 8, unit: 'kit', price: 678.00 },
        { itemNumber: 'COAG004', description: 'D-Dimer Reagent', analyzer: 'Stago Compact Max', current: 2, par: 6, unit: 'kit', price: 892.00 },
        { itemNumber: 'COAG005', description: 'Control N', analyzer: 'Stago Compact Max', current: 4, par: 8, unit: 'box', price: 245.00 },
        { itemNumber: 'COAG006', description: 'Control P', analyzer: 'Stago Compact Max', current: 4, par: 8, unit: 'box', price: 245.00 }
    ],
    kits: [
        { itemNumber: 'KIT001', description: 'HIV Rapid Test', analyzer: 'Manual', current: 10, par: 25, unit: 'kit', price: 285.00 },
        { itemNumber: 'KIT002', description: 'Malaria Rapid Test', analyzer: 'Manual', current: 5, par: 15, unit: 'kit', price: 195.00 },
        { itemNumber: 'KIT003', description: 'OSOM Strep A', analyzer: 'Manual', current: 8, par: 20, unit: 'kit', price: 165.00 },
        { itemNumber: 'KIT004', description: 'OSOM Flu A&B', analyzer: 'Manual', current: 12, par: 30, unit: 'kit', price: 225.00 },
        { itemNumber: 'KIT005', description: 'GeneXpert C. diff', analyzer: 'GeneXpert', current: 3, par: 10, unit: 'kit', price: 1450.00 },
        { itemNumber: 'KIT006', description: 'GeneXpert MRSA', analyzer: 'GeneXpert', current: 2, par: 8, unit: 'kit', price: 1650.00 },
        { itemNumber: 'KIT007', description: 'iSTAT Cartridges CG8+', analyzer: 'iSTAT', current: 15, par: 40, unit: 'box', price: 425.00 },
        { itemNumber: 'KIT008', description: 'iSTAT Cartridges CHEM8+', analyzer: 'iSTAT', current: 10, par: 30, unit: 'box', price: 385.00 },
        { itemNumber: 'KIT009', description: 'FFN Test Kit', analyzer: 'Manual', current: 4, par: 10, unit: 'kit', price: 525.00 },
        { itemNumber: 'KIT010', description: 'MedTox Drug Screen', analyzer: 'Manual', current: 20, par: 50, unit: 'cup', price: 12.50 }
    ],
    miscellaneous: [
        { itemNumber: 'MISC001', description: 'Purple Top Tubes', analyzer: 'N/A', current: 1000, par: 5000, unit: 'box', price: 65.00 },
        { itemNumber: 'MISC002', description: 'Red Top Tubes', analyzer: 'N/A', current: 800, par: 4000, unit: 'box', price: 58.00 },
        { itemNumber: 'MISC003', description: 'Blue Top Tubes', analyzer: 'N/A', current: 500, par: 2000, unit: 'box', price: 72.00 },
        { itemNumber: 'MISC004', description: 'Green Top Tubes', analyzer: 'N/A', current: 600, par: 3000, unit: 'box', price: 68.00 },
        { itemNumber: 'MISC005', description: 'Butterfly Needles 23G', analyzer: 'N/A', current: 200, par: 500, unit: 'box', price: 125.00 },
        { itemNumber: 'MISC006', description: 'Alcohol Wipes', analyzer: 'N/A', current: 50, par: 200, unit: 'box', price: 18.50 },
        { itemNumber: 'MISC007', description: 'Gauze 2x2', analyzer: 'N/A', current: 100, par: 300, unit: 'box', price: 12.00 },
        { itemNumber: 'MISC008', description: 'Gloves Small', analyzer: 'N/A', current: 20, par: 100, unit: 'box', price: 8.50 },
        { itemNumber: 'MISC009', description: 'Gloves Medium', analyzer: 'N/A', current: 30, par: 100, unit: 'box', price: 8.50 },
        { itemNumber: 'MISC010', description: 'Gloves Large', analyzer: 'N/A', current: 25, par: 100, unit: 'box', price: 8.50 }
    ]
};

// Load inventory data
function loadInventoryData() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let allItems = [];

    // Combine all departments
    Object.keys(inventoryDatabase).forEach(dept => {
        inventoryDatabase[dept].forEach(item => {
            allItems.push({...item, department: dept});
        });
    });

    // Render items
    allItems.forEach(item => {
        const row = createInventoryRow(item);
        tbody.appendChild(row);
    });

    updateInventoryCounts();
}

// Create inventory table row
function createInventoryRow(item) {
    const row = document.createElement('tr');
    const stockPercentage = (item.current / item.par) * 100;

    // Determine stock status
    let stockClass = '';
    let statusText = '';
    let statusColor = '';

    if (stockPercentage < 20) {
        stockClass = 'stock-critical';
        statusText = 'CRITICAL';
        statusColor = 'indicator-critical';
    } else if (stockPercentage < 50) {
        stockClass = 'stock-low';
        statusText = 'Low';
        statusColor = 'indicator-low';
    } else {
        stockClass = 'stock-good';
        statusText = 'Good';
        statusColor = 'indicator-good';
    }

    row.className = stockClass;
    row.innerHTML = `
        <td><input type="checkbox" class="item-checkbox" data-item="${item.itemNumber}" onchange="updateOrderSummary()"></td>
        <td>${item.itemNumber}</td>
        <td>${item.description}</td>
        <td>${item.department.charAt(0).toUpperCase() + item.department.slice(1)}</td>
        <td>${item.current} ${item.unit}</td>
        <td>${item.par} ${item.unit}</td>
        <td><span class="stock-indicator ${statusColor}"></span>${statusText}</td>
        <td><input type="number" class="form-control reorder-qty" value="${item.par - item.current}" min="0" style="width: 80px;"></td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="addToOrder('${item.itemNumber}')">Add to Order</button>
        </td>
    `;

    return row;
}

// Switch tabs
function switchTab(department) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(department).classList.add('active');

    // Load department-specific data if needed
    if (department !== 'all') {
        loadDepartmentData(department);
    }
}

// Load department-specific data
function loadDepartmentData(department) {
    const tbody = document.getElementById(department + '-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const items = inventoryDatabase[department] || [];

    items.forEach(item => {
        const row = createInventoryRow({...item, department});
        tbody.appendChild(row);
    });
}

// Check for critical items
function checkCriticalItems() {
    const alerts = [];
    let criticalCount = 0;
    let lowCount = 0;

    Object.keys(inventoryDatabase).forEach(dept => {
        inventoryDatabase[dept].forEach(item => {
            const percentage = (item.current / item.par) * 100;
            if (percentage < 20) {
                criticalCount++;
                alerts.push({
                    type: 'critical',
                    message: `${item.description} is critically low (${item.current}/${item.par} ${item.unit})`
                });
            } else if (percentage < 50) {
                lowCount++;
            }
        });
    });

    // Display alerts
    const alertContainer = document.getElementById('inventory-alerts');
    if (alertContainer) {
        if (alerts.length > 0) {
            alertContainer.innerHTML = `
                <div class="critical-box">
                    <strong>Critical Inventory Alert!</strong>
                    <ul>
                        ${alerts.map(a => `<li>${a.message}</li>`).join('')}
                    </ul>
                    <p>Automated order email will be generated for critical items.</p>
                </div>
            `;
        }
    }

    // Update counts
    updateElement('critical-items', criticalCount);
    updateElement('low-items', lowCount);
}

// Update order summary
function updateOrderSummary() {
    const selectedItems = [];
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');

    checkboxes.forEach(cb => {
        const itemNumber = cb.dataset.item;
        const row = cb.closest('tr');
        const qty = row.querySelector('.reorder-qty').value;

        // Find item in database
        let foundItem = null;
        Object.keys(inventoryDatabase).forEach(dept => {
            const item = inventoryDatabase[dept].find(i => i.itemNumber === itemNumber);
            if (item) {
                foundItem = {...item, orderQty: parseInt(qty), department: dept};
            }
        });

        if (foundItem) {
            selectedItems.push(foundItem);
        }
    });

    // Update summary display
    updateElement('items-selected', selectedItems.length);

    // Calculate total cost
    const totalCost = selectedItems.reduce((sum, item) => {
        return sum + (item.orderQty * item.price);
    }, 0);
    updateElement('total-cost', '$' + totalCost.toFixed(2));

    // Update email preview
    updateEmailPreview(selectedItems);
}

// Update email preview
function updateEmailPreview(items) {
    const emailBody = document.getElementById('email-body');
    if (!emailBody) return;

    if (items.length === 0) {
        emailBody.innerHTML = 'No items selected for order.';
        return;
    }

    let emailContent = `
        <p>Dear Inventory Team,</p>
        <p>Please process the following order for Largo Laboratory:</p>
        <table style="border-collapse: collapse; width: 100%;">
            <tr style="background: #0066cc; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">Item Number</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Description</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Department</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Unit</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Est. Cost</th>
            </tr>
    `;

    items.forEach(item => {
        emailContent += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.itemNumber}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.department}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.orderQty}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.unit}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${(item.orderQty * item.price).toFixed(2)}</td>
            </tr>
        `;
    });

    const totalCost = items.reduce((sum, item) => sum + (item.orderQty * item.price), 0);

    emailContent += `
        </table>
        <p><strong>Total Estimated Cost: $${totalCost.toFixed(2)}</strong></p>
        <p><strong>GL Code: 1808-18801-5693</strong></p>
        <p><strong>Account: 55042619</strong></p>
        <p>Please deliver to: Largo Laboratory, Kaiser Permanente</p>
        <p>Thank you,<br>Largo Laboratory Management</p>
    `;

    emailBody.innerHTML = emailContent;
}

// Send order via email
function sendOrder() {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
        alert('Please select items to order');
        return;
    }

    // Prepare email data
    const emailData = {
        to: 'largolabinventoryteam@KaiserPermanente.onmicrosoft.com',
        cc: [
            'Tianna.J.Maxwell@kp.org',
            'Alex.X.Roberson@kp.org',
            'john.f.ekpe@kp.org',
            'ugochi.l.ndubuisi@kp.org',
            'Emily.D.Creekmore@kp.org',
            'Ingrid.Z.Benitez-Ruiz@kp.org',
            'Maxwell.L.Booker@kp.org'
        ],
        subject: `Largo Laboratory Inventory Order - ${new Date().toLocaleDateString()}`,
        items: selectedItems,
        glCode: '1808-18801-5693',
        account: '55042619'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('inventoryOrders')) || [];
    orders.push({
        date: new Date().toISOString(),
        items: selectedItems,
        status: 'sent',
        totalCost: selectedItems.reduce((sum, item) => sum + (item.orderQty * item.price), 0)
    });
    localStorage.setItem('inventoryOrders', JSON.stringify(orders));

    // Create mailto link (fallback for actual email integration)
    const mailtoLink = createMailtoLink(emailData);
    window.location.href = mailtoLink;

    // Show success message
    showSuccessMessage('Order email prepared. Please send from your email client.');

    // Clear selections
    clearSelections();
}

// Create mailto link for email
function createMailtoLink(emailData) {
    const to = emailData.to;
    const cc = emailData.cc.join(',');
    const subject = encodeURIComponent(emailData.subject);

    let body = `Dear Inventory Team,%0D%0A%0D%0A`;
    body += `Please process the following order for Largo Laboratory:%0D%0A%0D%0A`;

    emailData.items.forEach(item => {
        body += `${item.itemNumber} - ${item.description}: ${item.orderQty} ${item.unit}%0D%0A`;
    });

    const totalCost = emailData.items.reduce((sum, item) => sum + (item.orderQty * item.price), 0);
    body += `%0D%0ATotal Estimated Cost: $${totalCost.toFixed(2)}%0D%0A`;
    body += `GL Code: ${emailData.glCode}%0D%0A`;
    body += `Account: ${emailData.account}%0D%0A%0D%0A`;
    body += `Please deliver to: Largo Laboratory, Kaiser Permanente%0D%0A%0D%0A`;
    body += `Thank you,%0D%0ALargo Laboratory Management`;

    return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

// Get selected items
function getSelectedItems() {
    const selectedItems = [];
    const checkboxes = document.querySelectorAll('.item-checkbox:checked');

    checkboxes.forEach(cb => {
        const itemNumber = cb.dataset.item;
        const row = cb.closest('tr');
        const qty = row.querySelector('.reorder-qty').value;

        Object.keys(inventoryDatabase).forEach(dept => {
            const item = inventoryDatabase[dept].find(i => i.itemNumber === itemNumber);
            if (item) {
                selectedItems.push({...item, orderQty: parseInt(qty), department: dept});
            }
        });
    });

    return selectedItems;
}

// Export to Excel
function exportToExcel() {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
        alert('Please select items to export');
        return;
    }

    // Create CSV content
    let csvContent = 'Item Number,Description,Department,Current Stock,PAR Level,Order Quantity,Unit,Unit Price,Total Cost\n';

    selectedItems.forEach(item => {
        const totalCost = item.orderQty * item.price;
        csvContent += `"${item.itemNumber}","${item.description}","${item.department}",${item.current},${item.par},${item.orderQty},"${item.unit}",${item.price},${totalCost}\n`;
    });

    // Add total row
    const grandTotal = selectedItems.reduce((sum, item) => sum + (item.orderQty * item.price), 0);
    csvContent += `,,,,,,,,${grandTotal}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Largo_Lab_Inventory_Order_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    link.click();
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const stockFilter = document.getElementById('stock-filter').value;
    const deptFilter = document.getElementById('department-filter').value;

    const rows = document.querySelectorAll('#inventory-tbody tr');

    rows.forEach(row => {
        const description = row.cells[2].textContent.toLowerCase();
        const department = row.cells[3].textContent.toLowerCase();
        const status = row.cells[6].textContent.toLowerCase();

        let showRow = true;

        // Search filter
        if (searchTerm && !description.includes(searchTerm)) {
            showRow = false;
        }

        // Stock level filter
        if (stockFilter !== 'all') {
            if (stockFilter === 'critical' && !status.includes('critical')) showRow = false;
            if (stockFilter === 'low' && !status.includes('low')) showRow = false;
            if (stockFilter === 'good' && !status.includes('good')) showRow = false;
            if (stockFilter === 'reorder' && (status.includes('good'))) showRow = false;
        }

        // Department filter
        if (deptFilter !== 'all' && !department.includes(deptFilter)) {
            showRow = false;
        }

        row.style.display = showRow ? '' : 'none';
    });
}

// Reset filters
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('stock-filter').value = 'all';
    document.getElementById('department-filter').value = 'all';

    const rows = document.querySelectorAll('#inventory-tbody tr');
    rows.forEach(row => row.style.display = '');
}

// Toggle auto-order
function toggleAutoOrder() {
    const enabled = document.getElementById('auto-order-enabled').checked;
    document.getElementById('auto-order-settings').style.display = enabled ? 'block' : 'none';

    if (enabled) {
        startInventoryMonitoring();
    } else {
        stopInventoryMonitoring();
    }
}

// Start inventory monitoring
let monitoringInterval;
function startInventoryMonitoring() {
    const settings = getAutoOrderSettings();

    if (!settings.enabled) return;

    // Clear existing interval
    if (monitoringInterval) clearInterval(monitoringInterval);

    // Check inventory at specified intervals
    monitoringInterval = setInterval(() => {
        checkInventoryLevels();
    }, settings.alertFrequency * 60 * 60 * 1000); // Convert hours to milliseconds

    // Also check at specified times
    checkAtScheduledTimes(settings);
}

// Stop inventory monitoring
function stopInventoryMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }
}

// Check inventory levels
function checkInventoryLevels() {
    const settings = getAutoOrderSettings();
    const criticalItems = [];

    Object.keys(inventoryDatabase).forEach(dept => {
        inventoryDatabase[dept].forEach(item => {
            const percentage = (item.current / item.par) * 100;
            if (percentage < settings.threshold) {
                criticalItems.push(item);
            }
        });
    });

    if (criticalItems.length > 0) {
        generateAutoOrder(criticalItems);
    }
}

// Generate automatic order
function generateAutoOrder(items) {
    const orderData = {
        date: new Date().toISOString(),
        items: items.map(item => ({
            ...item,
            orderQty: item.par - item.current
        })),
        type: 'automatic',
        status: 'pending'
    };

    // Save to localStorage
    const autoOrders = JSON.parse(localStorage.getItem('autoOrders')) || [];
    autoOrders.push(orderData);
    localStorage.setItem('autoOrders', JSON.stringify(autoOrders));

    // Show notification
    showNotification('Automatic order generated for ' + items.length + ' critical items');
}

// Helper functions
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function updateOrderDate() {
    const dateElement = document.getElementById('order-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString();
    }
}

function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.textContent = message;
    div.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('Largo Lab Inventory', {
            body: message,
            icon: '../assets/kp-logo.svg'
        });
    } else {
        showSuccessMessage(message);
    }
}

function getAutoOrderSettings() {
    return JSON.parse(localStorage.getItem('autoOrderSettings')) || {
        enabled: false,
        morningCheck: '07:00',
        afternoonCheck: '15:00',
        alertFrequency: 4,
        threshold: 30
    };
}

function saveAutoOrderSettings() {
    const settings = {
        enabled: document.getElementById('auto-order-enabled').checked,
        morningCheck: document.getElementById('morning-check').value,
        afternoonCheck: document.getElementById('afternoon-check').value,
        alertFrequency: parseInt(document.getElementById('alert-frequency').value),
        threshold: parseInt(document.getElementById('auto-threshold').value)
    };

    localStorage.setItem('autoOrderSettings', JSON.stringify(settings));
    showSuccessMessage('Auto-order settings saved');

    if (settings.enabled) {
        startInventoryMonitoring();
    }
}

function loadAutoOrderSettings() {
    const settings = getAutoOrderSettings();

    document.getElementById('auto-order-enabled').checked = settings.enabled;
    document.getElementById('morning-check').value = settings.morningCheck;
    document.getElementById('afternoon-check').value = settings.afternoonCheck;
    document.getElementById('alert-frequency').value = settings.alertFrequency;
    document.getElementById('auto-threshold').value = settings.threshold;

    if (settings.enabled) {
        document.getElementById('auto-order-settings').style.display = 'block';
    }
}

function checkAtScheduledTimes(settings) {
    const checkTimes = [settings.morningCheck, settings.afternoonCheck];

    setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (checkTimes.includes(currentTime)) {
            checkInventoryLevels();
        }
    }, 60000); // Check every minute
}

function toggleSelectAll() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.item-checkbox');

    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });

    updateOrderSummary();
}

function addToOrder(itemNumber) {
    const checkbox = document.querySelector(`.item-checkbox[data-item="${itemNumber}"]`);
    if (checkbox) {
        checkbox.checked = true;
        updateOrderSummary();
    }
}

function clearSelections() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    updateOrderSummary();
}

function saveOrder() {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
        alert('Please select items to save');
        return;
    }

    const draft = {
        date: new Date().toISOString(),
        items: selectedItems,
        status: 'draft'
    };

    localStorage.setItem('inventoryOrderDraft', JSON.stringify(draft));
    showSuccessMessage('Order draft saved');
}

function previewOrder() {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
        alert('Please select items to preview');
        return;
    }

    // Scroll to email preview
    document.getElementById('email-preview').scrollIntoView({ behavior: 'smooth' });
}

function updateInventoryCounts() {
    let criticalCount = 0;
    let lowCount = 0;

    Object.keys(inventoryDatabase).forEach(dept => {
        inventoryDatabase[dept].forEach(item => {
            const percentage = (item.current / item.par) * 100;
            if (percentage < 20) criticalCount++;
            else if (percentage < 50) lowCount++;
        });
    });

    updateElement('critical-items', criticalCount);
    updateElement('low-items', lowCount);
}

function setupEventListeners() {
    // Add event listeners for real-time search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}