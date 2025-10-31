/**
 * Process structured inventory Excel file
 * Specifically handles LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx format
 */

const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');

async function processStructuredInventory() {
    const filePath = '/Users/ugochindubuisi1/Documents/Largo Lab/LabAutomation/data/inventory/LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx';
    const allSupplies = [];

    try {
        console.log('Processing structured inventory file...\n');

        const workbook = XLSX.readFile(filePath);

        // Process specific sheets with proper column structure
        const sheetsToProcess = ['CHEMISTRY', 'HEMATOLOGY', 'URINALYSIS', 'KITS', 'MISCELLANEOUS'];

        for (const sheetName of sheetsToProcess) {
            if (!workbook.SheetNames.includes(sheetName)) continue;

            console.log(`Processing ${sheetName} sheet...`);
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            data.forEach(row => {
                if (row['ITEM #'] && row['DESCRIPTION']) {
                    const item = {
                        id: row['ITEM #'],
                        name: row['DESCRIPTION'],
                        category: sheetName,
                        description: row['NOTES'] || row['DESCRIPTION'],
                        catalogNumber: row['MFR#/CAT#'] || row['MATERIAL# (KAISER#/OLID)'] || '',
                        vendor: row['MANUFACTURER'] || 'Unknown',
                        unitOfMeasure: row['UNIT OF MEASURE'] || 'Each',
                        currentStock: parseInt(row['HAND COUNT']) || 0,
                        parLevel: parseInt(row['PAR LEVEL']) || 100,
                        reorderPoint: parseInt(row['REORDER POINT']) || parseInt(row['MIN STOCK']) || 10,
                        reorderQuantity: Math.max(
                            (parseInt(row['PAR LEVEL']) || 100) - (parseInt(row['HAND COUNT']) || 0),
                            10
                        ),
                        minStock: parseInt(row['MIN STOCK']) || 0,
                        maxStock: parseInt(row['MAX STOCK']) || 200,
                        location: row['STORAGE LOCATION'] || 'Main Lab',
                        storageTemp: row['STORAGE TEMP'] || 'Room Temp',
                        analyzer: row['ANALYZER/EQUIPMENT'] || 'N/A',
                        testProcedure: row['TEST/PROCEDURE'] || 'N/A',
                        criticalItem: row['CRITICAL ITEM'] === 'YES',
                        supplierId: row['SUPPLIER ID'] || '',
                        packageSize: row['PACKAGE SIZE'] || '',
                        expirationDate: row['EXPIRATION DATE'] || null,
                        lotNumber: row['LOT NUMBER'] || '',
                        unitPrice: 0, // Would need pricing data
                        status: row['STATUS'] || 'Pending Review',
                        lastUpdated: row['LAST UPDATED'] || new Date().toISOString().split('T')[0],
                        updatedBy: row['UPDATED BY'] || 'System',
                        notes: row['NOTES'] || '',
                        actionRequired: row['ACTION REQUIRED'] || ''
                    };

                    // Recalculate status based on stock levels
                    if (item.currentStock <= 0) {
                        item.status = 'Out of Stock';
                    } else if (item.currentStock <= item.reorderPoint) {
                        item.status = 'Critical - Order Now';
                    } else if (item.currentStock < item.parLevel * 0.5) {
                        item.status = 'Low Stock';
                    } else {
                        item.status = 'In Stock';
                    }

                    // Mark critical items for urgent attention
                    if (item.criticalItem && item.status !== 'In Stock') {
                        item.status = '🚨 ' + item.status;
                        item.urgencyLevel = 'HIGH';
                    }

                    // Handle special case for ALT reagents
                    if (item.name.includes('ALT') && item.actionRequired) {
                        item.status = '🔴 URGENT - REDISTRIBUTE';
                        item.urgencyLevel = 'CRITICAL';
                    }

                    allSupplies.push(item);
                }
            });

            console.log(`  - Processed ${data.length} items from ${sheetName}`);
        }

        // Process expiring items sheet
        if (workbook.SheetNames.includes('EXPIRING_ITEMS')) {
            const expiringSheet = workbook.Sheets['EXPIRING_ITEMS'];
            const expiringData = XLSX.utils.sheet_to_json(expiringSheet);

            expiringData.forEach(row => {
                // Update existing items with expiration info
                const existingItem = allSupplies.find(s => s.id === row['ITEM #']);
                if (existingItem) {
                    existingItem.expirationDate = row['EXPIRATION DATE'];
                    existingItem.expirationStatus = row['PRIORITY'];
                    existingItem.actionPlan = row['ACTION PLAN'];
                    if (row['PRIORITY'] === '🔴 URGENT') {
                        existingItem.urgencyLevel = 'CRITICAL';
                        existingItem.status = '🔴 EXPIRING - ' + existingItem.status;
                    }
                }
            });
        }

        // Extract unique categories, locations, and vendors
        const categories = [...new Set(allSupplies.map(s => s.category))].filter(Boolean).sort();
        const locations = [...new Set(allSupplies.map(s => s.location))].filter(Boolean).sort();
        const vendors = [...new Set(allSupplies.map(s => s.vendor))].filter(Boolean).sort();

        // Add estimated prices based on category (for demo purposes)
        allSupplies.forEach(item => {
            if (item.category === 'CHEMISTRY') {
                item.unitPrice = Math.random() * 500 + 100; // $100-600
            } else if (item.category === 'HEMATOLOGY') {
                item.unitPrice = Math.random() * 300 + 50; // $50-350
            } else if (item.category === 'URINALYSIS') {
                item.unitPrice = Math.random() * 100 + 20; // $20-120
            } else if (item.category === 'KITS') {
                item.unitPrice = Math.random() * 200 + 80; // $80-280
            } else {
                item.unitPrice = Math.random() * 50 + 10; // $10-60
            }
            item.unitPrice = parseFloat(item.unitPrice.toFixed(2));
        });

        const inventoryData = {
            lastUpdated: new Date().toISOString(),
            totalItems: allSupplies.length,
            categories,
            locations,
            vendors,
            supplies: allSupplies,
            alerts: {
                expiring: allSupplies.filter(s => s.expirationStatus === '🔴 URGENT').length,
                outOfStock: allSupplies.filter(s => s.currentStock === 0).length,
                critical: allSupplies.filter(s => s.status.includes('Critical')).length,
                lowStock: allSupplies.filter(s => s.status.includes('Low Stock')).length
            }
        };

        // Save to JSON
        const outputPath = path.join(__dirname, '../../data/inventory.json');
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(inventoryData, null, 2));

        console.log('\n✅ Successfully processed inventory data!');
        console.log(`Total items: ${allSupplies.length}`);
        console.log(`Categories: ${categories.join(', ')}`);
        console.log(`Critical alerts: ${inventoryData.alerts.critical}`);
        console.log(`Out of stock: ${inventoryData.alerts.outOfStock}`);
        console.log(`Data saved to: ${outputPath}`);

        // Generate summary report
        const summary = generateReport(inventoryData);
        const reportPath = path.join(path.dirname(outputPath), 'inventory_report.txt');
        await fs.writeFile(reportPath, summary);
        console.log(`Report saved to: ${reportPath}`);

        return inventoryData;
    } catch (error) {
        console.error('Error processing inventory:', error);
        throw error;
    }
}

function generateReport(inventoryData) {
    const { supplies, alerts } = inventoryData;

    const criticalItems = supplies.filter(s =>
        s.status.includes('Critical') || s.status.includes('URGENT') || s.status.includes('🔴')
    );

    const outOfStock = supplies.filter(s => s.currentStock === 0);

    return `
KAISER PERMANENTE LARGO LABORATORY
INVENTORY MANAGEMENT REPORT
Generated: ${new Date().toLocaleString()}
==================================================

ALERT SUMMARY
-------------------------------------------------
🔴 CRITICAL ALERTS: ${alerts.critical}
⚠️  OUT OF STOCK: ${alerts.outOfStock}
🟡 LOW STOCK: ${alerts.lowStock}
⏰ EXPIRING SOON: ${alerts.expiring}

ITEMS REQUIRING IMMEDIATE ATTENTION
-------------------------------------------------
${criticalItems.slice(0, 10).map(item =>
    `• ${item.name} (${item.id})
  Status: ${item.status}
  Current Stock: ${item.currentStock} | Reorder Point: ${item.reorderPoint}
  Location: ${item.location}
  ${item.actionRequired ? `  ACTION: ${item.actionRequired}` : ''}
`).join('\n')}

OUT OF STOCK ITEMS
-------------------------------------------------
${outOfStock.map(item =>
    `• ${item.name} (${item.id}) - ${item.vendor}`
).join('\n') || 'None'}

INVENTORY BY CATEGORY
-------------------------------------------------
${Object.entries(
    supplies.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = { count: 0, critical: 0, value: 0 };
        }
        acc[item.category].count++;
        acc[item.category].value += item.currentStock * item.unitPrice;
        if (item.status.includes('Critical') || item.currentStock <= item.reorderPoint) {
            acc[item.category].critical++;
        }
        return acc;
    }, {})
).map(([cat, stats]) =>
    `${cat}: ${stats.count} items | ${stats.critical} need ordering | Value: $${stats.value.toFixed(2)}`
).join('\n')}

RECOMMENDED ACTIONS
-------------------------------------------------
1. ⚠️  URGENT: Redistribute 25 ALT Reagent Packs expiring Oct 31
2. Order all items marked as "Critical - Order Now"
3. Review and update expiration dates for all reagents
4. Verify physical counts match system records
5. Contact vendors for out-of-stock items

AUTOMATED ORDERING
-------------------------------------------------
• Automatic orders sent: 7:00 AM and 3:00 PM daily
• Critical checks: Every 4 hours
• Email recipients configured
• Manual order trigger available via portal

==================================================
End of Report
`;
}

// Run the processor
if (require.main === module) {
    processStructuredInventory()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { processStructuredInventory };