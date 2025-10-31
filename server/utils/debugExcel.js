const XLSX = require('xlsx');

// Check the structure of an Excel file
const filePath = '/Users/ugochindubuisi1/Documents/Largo Lab/LabAutomation/data/inventory/LARGO_LAB_INVENTORY_WITH_PAR_LEVELS.xlsx';

try {
    console.log(`Analyzing: ${filePath}\n`);

    const workbook = XLSX.readFile(filePath);

    console.log('Sheet names:', workbook.SheetNames);

    workbook.SheetNames.forEach((sheetName, index) => {
        console.log(`\n=== Sheet ${index + 1}: ${sheetName} ===`);

        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Total rows: ${data.length}`);

        if (data.length > 0) {
            console.log('\nColumn names:', Object.keys(data[0]));
            console.log('\nFirst 3 rows:');
            data.slice(0, 3).forEach((row, i) => {
                console.log(`Row ${i + 1}:`, JSON.stringify(row, null, 2));
            });
        }
    });
} catch (error) {
    console.error('Error reading file:', error.message);
}