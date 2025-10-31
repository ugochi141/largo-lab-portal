/**
 * Excel to JSON Converter for Inventory Data
 * Converts Excel inventory files to JSON format for the portal
 * Kaiser Permanente Largo Laboratory
 */

const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');

class ExcelConverter {
    constructor() {
        this.inventoryFiles = [
            '/Users/ugochindubuisi1/Downloads/Inventory List Largo 03MAR25_Shanthi and Nate B_09092025.xlsx',
            '/Users/ugochindubuisi1/Downloads/Inventory List Largo 25MAR25.xlsx',
            '/Users/ugochindubuisi1/Downloads/Inventory Spreadsheet.xlsx',
            '/Users/ugochindubuisi1/Documents/Largo Lab/LabAutomation/data/inventory/LARGO_LAB_INVENTORY_CURRENT.xlsx',
            '/Users/ugochindubuisi1/Documents/Largo Lab/LabAutomation/data/inventory/LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx',
            '/Users/ugochindubuisi1/Documents/Largo Lab/LabAutomation/data/inventory/LARGO_LAB_DETAILED_INVENTORY_SYSTEM.xlsx'
        ];
    }

    /**
     * Convert Excel file to inventory JSON format
     */
    async convertExcelToInventory(filePath) {
        try {
            console.log(`Processing: ${path.basename(filePath)}`);

            // Read Excel file
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const rawData = XLSX.utils.sheet_to_json(worksheet);

            // Process and format data
            const supplies = this.processInventoryData(rawData);

            return supplies;
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error.message);
            return [];
        }
    }

    /**
     * Process raw Excel data into standardized inventory format
     */
    processInventoryData(rawData) {
        const supplies = [];
        let idCounter = 1;

        rawData.forEach((row, index) => {
            try {
                // Map various possible column names to our standard format
                const item = {
                    id: `SUP${String(idCounter++).padStart(3, '0')}`,
                    name: this.extractField(row, ['Item Name', 'Product', 'Description', 'Name', 'Item', 'Product Name']),
                    category: this.extractField(row, ['Category', 'Type', 'Department', 'Item Type', 'Product Category']),
                    description: this.extractField(row, ['Description', 'Details', 'Product Description', 'Full Description']),
                    catalogNumber: this.extractField(row, ['Catalog #', 'Catalog Number', 'Cat #', 'Item #', 'Part Number', 'SKU']),
                    vendor: this.extractField(row, ['Vendor', 'Supplier', 'Manufacturer', 'Company']),
                    unitOfMeasure: this.extractField(row, ['Unit', 'UOM', 'Unit of Measure', 'Package Size']),
                    currentStock: this.parseNumber(this.extractField(row, ['Current Stock', 'Quantity', 'On Hand', 'Current', 'In Stock', 'Qty'])),
                    parLevel: this.parseNumber(this.extractField(row, ['PAR Level', 'PAR', 'Maximum', 'Max Stock', 'Par'])),
                    reorderPoint: this.parseNumber(this.extractField(row, ['Reorder Point', 'Min', 'Minimum', 'Min Stock', 'ROP'])),
                    reorderQuantity: this.parseNumber(this.extractField(row, ['Reorder Qty', 'Order Quantity', 'Order Qty', 'EOQ'])),
                    location: this.extractField(row, ['Location', 'Storage Location', 'Storage', 'Bin', 'Area']),
                    expirationDate: this.parseDate(this.extractField(row, ['Expiration Date', 'Exp Date', 'Expires', 'Expiry'])),
                    lotNumber: this.extractField(row, ['Lot #', 'Lot Number', 'Batch', 'Batch Number', 'Lot']),
                    unitPrice: this.parseNumber(this.extractField(row, ['Unit Price', 'Price', 'Cost', 'Unit Cost', 'Price Each'])),
                    status: 'Pending Review',
                    notes: this.extractField(row, ['Notes', 'Comments', 'Remarks', 'Additional Info'])
                };

                // Only add if we have at least a name
                if (item.name) {
                    // Set defaults if missing
                    item.category = item.category || 'General Lab Supplies';
                    item.vendor = item.vendor || 'Unknown Vendor';
                    item.unitOfMeasure = item.unitOfMeasure || 'Each';
                    item.currentStock = item.currentStock || 0;
                    item.parLevel = item.parLevel || 100;
                    item.reorderPoint = item.reorderPoint || Math.floor(item.parLevel * 0.3);
                    item.reorderQuantity = item.reorderQuantity || Math.floor(item.parLevel * 0.5);
                    item.location = item.location || 'Main Lab';
                    item.unitPrice = item.unitPrice || 0;

                    // Calculate status based on stock levels
                    if (item.currentStock <= 0) {
                        item.status = 'Out of Stock';
                    } else if (item.currentStock <= item.reorderPoint) {
                        item.status = 'Critical - Order Now';
                    } else if (item.currentStock < item.parLevel * 0.5) {
                        item.status = 'Low Stock';
                    } else {
                        item.status = 'In Stock';
                    }

                    supplies.push(item);
                }
            } catch (error) {
                console.error(`Error processing row ${index + 1}:`, error.message);
            }
        });

        return supplies;
    }

    /**
     * Extract field from row with multiple possible column names
     */
    extractField(row, possibleNames) {
        for (const name of possibleNames) {
            if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
                return String(row[name]).trim();
            }
        }
        return null;
    }

    /**
     * Parse number from various formats
     */
    parseNumber(value) {
        if (!value) return 0;
        // Remove any non-numeric characters except decimal point
        const cleaned = String(value).replace(/[^0-9.-]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    /**
     * Parse date from various formats
     */
    parseDate(value) {
        if (!value) return null;

        // Handle Excel serial date numbers
        if (typeof value === 'number') {
            const excelDate = new Date((value - 25569) * 86400 * 1000);
            return excelDate.toISOString().split('T')[0];
        }

        // Try to parse string dates
        try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (e) {
            // Invalid date
        }

        return null;
    }

    /**
     * Merge multiple Excel files into consolidated inventory
     */
    async mergeAllInventoryFiles() {
        console.log('Starting inventory file consolidation...');
        const allSupplies = [];
        const seenItems = new Set();

        for (const filePath of this.inventoryFiles) {
            try {
                // Check if file exists
                await fs.access(filePath);

                const supplies = await this.convertExcelToInventory(filePath);

                // Deduplicate based on catalog number or name
                supplies.forEach(item => {
                    const key = item.catalogNumber || item.name;
                    if (!seenItems.has(key)) {
                        seenItems.add(key);
                        allSupplies.push(item);
                    } else {
                        // Update existing item with better data if available
                        const existingIndex = allSupplies.findIndex(
                            s => (s.catalogNumber === item.catalogNumber) || (s.name === item.name)
                        );
                        if (existingIndex !== -1) {
                            // Merge data, preferring non-empty values
                            const existing = allSupplies[existingIndex];
                            if (!existing.catalogNumber && item.catalogNumber) {
                                existing.catalogNumber = item.catalogNumber;
                            }
                            if (!existing.vendor || existing.vendor === 'Unknown Vendor') {
                                existing.vendor = item.vendor;
                            }
                            // Update stock to latest value
                            if (item.currentStock !== 0) {
                                existing.currentStock = item.currentStock;
                            }
                        }
                    }
                });

                console.log(`Processed ${supplies.length} items from ${path.basename(filePath)}`);
            } catch (error) {
                console.log(`Skipping ${path.basename(filePath)}: File not accessible`);
            }
        }

        // Extract unique categories, locations, and vendors
        const categories = [...new Set(allSupplies.map(s => s.category))].filter(Boolean).sort();
        const locations = [...new Set(allSupplies.map(s => s.location))].filter(Boolean).sort();
        const vendors = [...new Set(allSupplies.map(s => s.vendor))].filter(Boolean).sort();

        const inventoryData = {
            lastUpdated: new Date().toISOString(),
            totalItems: allSupplies.length,
            categories,
            locations,
            vendors,
            supplies: allSupplies
        };

        console.log(`\nConsolidation complete:`);
        console.log(`- Total unique items: ${allSupplies.length}`);
        console.log(`- Categories: ${categories.length}`);
        console.log(`- Locations: ${locations.length}`);
        console.log(`- Vendors: ${vendors.length}`);

        return inventoryData;
    }

    /**
     * Save consolidated inventory to JSON file
     */
    async saveInventoryJSON(inventoryData, outputPath) {
        try {
            const jsonPath = outputPath || path.join(__dirname, '../../data/inventory.json');

            // Ensure directory exists
            const dir = path.dirname(jsonPath);
            await fs.mkdir(dir, { recursive: true });

            // Save JSON file
            await fs.writeFile(jsonPath, JSON.stringify(inventoryData, null, 2));

            console.log(`\nInventory data saved to: ${jsonPath}`);

            // Generate summary report
            const summary = this.generateSummaryReport(inventoryData);
            const summaryPath = path.join(dir, 'inventory_summary.txt');
            await fs.writeFile(summaryPath, summary);

            console.log(`Summary report saved to: ${summaryPath}`);

            return jsonPath;
        } catch (error) {
            console.error('Error saving inventory data:', error);
            throw error;
        }
    }

    /**
     * Generate summary report
     */
    generateSummaryReport(inventoryData) {
        const { supplies } = inventoryData;

        // Calculate statistics
        const outOfStock = supplies.filter(s => s.status === 'Out of Stock');
        const critical = supplies.filter(s => s.status === 'Critical - Order Now');
        const lowStock = supplies.filter(s => s.status === 'Low Stock');
        const totalValue = supplies.reduce((sum, s) => sum + (s.currentStock * s.unitPrice), 0);

        // Group by category
        const byCategory = {};
        supplies.forEach(s => {
            if (!byCategory[s.category]) {
                byCategory[s.category] = { count: 0, value: 0, critical: 0 };
            }
            byCategory[s.category].count++;
            byCategory[s.category].value += s.currentStock * s.unitPrice;
            if (s.status === 'Critical - Order Now' || s.status === 'Out of Stock') {
                byCategory[s.category].critical++;
            }
        });

        let report = `LARGO LABORATORY INVENTORY SUMMARY REPORT
Generated: ${new Date().toLocaleString()}
========================================

OVERVIEW
--------
Total Items: ${supplies.length}
Total Inventory Value: $${totalValue.toFixed(2)}

STOCK STATUS
------------
Out of Stock: ${outOfStock.length} items
Critical - Order Now: ${critical.length} items
Low Stock: ${lowStock.length} items
In Stock: ${supplies.filter(s => s.status === 'In Stock').length} items

CRITICAL ITEMS REQUIRING IMMEDIATE ATTENTION
--------------------------------------------
${critical.slice(0, 10).map(item =>
    `- ${item.name} (${item.catalogNumber || 'No Cat#'}) - Current: ${item.currentStock}, Need: ${item.reorderQuantity}`
).join('\n')}

OUT OF STOCK ITEMS
------------------
${outOfStock.slice(0, 10).map(item =>
    `- ${item.name} (${item.catalogNumber || 'No Cat#'}) - Vendor: ${item.vendor}`
).join('\n')}

INVENTORY BY CATEGORY
---------------------
${Object.entries(byCategory)
    .sort((a, b) => b[1].critical - a[1].critical)
    .map(([category, stats]) =>
        `${category}: ${stats.count} items, Value: $${stats.value.toFixed(2)}, Critical: ${stats.critical}`
    ).join('\n')}

TOP VENDORS
-----------
${inventoryData.vendors.slice(0, 10).join('\n')}

STORAGE LOCATIONS
-----------------
${inventoryData.locations.slice(0, 10).join('\n')}

ACTIONS REQUIRED
----------------
1. Review and order all CRITICAL items immediately
2. Contact vendors for OUT OF STOCK items
3. Update expiration dates for items nearing expiry
4. Verify PAR levels are appropriate for usage patterns
5. Schedule physical inventory count for accuracy

========================================
End of Report
`;

        return report;
    }

    /**
     * Main conversion process
     */
    async convertAndSave() {
        try {
            console.log('Starting Excel to JSON conversion process...\n');

            // Merge all inventory files
            const inventoryData = await this.mergeAllInventoryFiles();

            // Save to JSON
            const savedPath = await this.saveInventoryJSON(inventoryData);

            console.log('\n✅ Conversion completed successfully!');
            console.log(`\nNext steps:`);
            console.log(`1. Review the generated inventory.json file`);
            console.log(`2. Start the server to load the inventory data`);
            console.log(`3. Access the inventory management system through the portal`);

            return inventoryData;
        } catch (error) {
            console.error('\n❌ Conversion failed:', error);
            throw error;
        }
    }
}

// Export the converter
module.exports = ExcelConverter;

// Run if called directly
if (require.main === module) {
    const converter = new ExcelConverter();
    converter.convertAndSave()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}