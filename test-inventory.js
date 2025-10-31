/**
 * Test Script for Laboratory Inventory Management System
 * Tests inventory API endpoints and automatic ordering functionality
 * Kaiser Permanente Largo Laboratory
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/inventory';

// Test configuration
const config = {
    runEmailTests: false, // Set to true to test actual email sending
    testDelay: 1000 // Delay between tests in ms
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test functions
async function testGetInventory() {
    log('\n📦 Testing: Get all inventory items', colors.blue);
    try {
        const response = await axios.get(BASE_URL);
        const { supplies, categories, locations, vendors } = response.data;

        log(`✅ Successfully retrieved ${supplies.length} items`, colors.green);
        log(`   Categories: ${categories.length}`, colors.green);
        log(`   Locations: ${locations.length}`, colors.green);
        log(`   Vendors: ${vendors.length}`, colors.green);

        // Show some sample items
        const criticalItems = supplies.filter(s =>
            s.status?.includes('Critical') || s.currentStock === 0
        );
        if (criticalItems.length > 0) {
            log(`\n⚠️  Found ${criticalItems.length} critical items:`, colors.yellow);
            criticalItems.slice(0, 3).forEach(item => {
                log(`   - ${item.name}: Stock ${item.currentStock}/${item.parLevel}`, colors.yellow);
            });
        }

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testGetSingleItem() {
    log('\n🔍 Testing: Get single inventory item', colors.blue);
    try {
        const itemId = 'CH001'; // Test with Chemistry item
        const response = await axios.get(`${BASE_URL}/${itemId}`);
        const item = response.data;

        log(`✅ Retrieved item: ${item.name}`, colors.green);
        log(`   Current Stock: ${item.currentStock}`, colors.green);
        log(`   Status: ${item.status}`, colors.green);
        log(`   Needs Reorder: ${item.needsReorder}`, colors.green);

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testUpdateStock() {
    log('\n📝 Testing: Update inventory stock', colors.blue);
    try {
        const itemId = 'CH003'; // Glucose reagent
        const updateData = {
            quantity: 5,
            operation: 'remove',
            reason: 'Used for daily testing'
        };

        const response = await axios.patch(`${BASE_URL}/${itemId}/stock`, updateData);
        const result = response.data;

        log(`✅ Stock updated successfully`, colors.green);
        log(`   Item: ${result.item.name}`, colors.green);
        log(`   Old Stock: ${result.transaction.oldStock}`, colors.green);
        log(`   New Stock: ${result.transaction.newStock}`, colors.green);
        log(`   New Status: ${result.item.status}`, colors.green);

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testGetReorderAlerts() {
    log('\n🚨 Testing: Get items needing reorder', colors.blue);
    try {
        const response = await axios.get(`${BASE_URL}/alerts/reorder`);
        const { itemsToReorder, criticalItems, estimatedCost } = response.data;

        log(`✅ Reorder alerts retrieved`, colors.green);
        log(`   Items to reorder: ${itemsToReorder.length}`, colors.green);
        log(`   Critical items: ${criticalItems.length}`, colors.red);
        log(`   Estimated cost: $${estimatedCost}`, colors.green);

        if (itemsToReorder.length > 0) {
            log(`\n   Sample items needing reorder:`, colors.yellow);
            itemsToReorder.slice(0, 3).forEach(item => {
                log(`   - ${item.name}: ${item.currentStock}/${item.reorderPoint} (Order ${item.reorderQuantity})`,
                    colors.yellow);
            });
        }

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testGetExpiringItems() {
    log('\n⏰ Testing: Get expiring items', colors.blue);
    try {
        const response = await axios.get(`${BASE_URL}/alerts/expiring?days=90`);
        const { expiringItems, expired, urgentCount } = response.data;

        log(`✅ Expiration alerts retrieved`, colors.green);
        log(`   Expiring within 90 days: ${expiringItems.length}`, colors.green);
        log(`   Already expired: ${expired.length}`, colors.red);
        log(`   Urgent (within 30 days): ${urgentCount}`, colors.yellow);

        if (expiringItems.length > 0) {
            log(`\n   Sample expiring items:`, colors.yellow);
            expiringItems.slice(0, 3).forEach(item => {
                log(`   - ${item.name}: Expires ${item.expirationDate}`, colors.yellow);
            });
        }

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testGenerateOrderReport() {
    log('\n📊 Testing: Generate order report', colors.blue);
    try {
        const response = await axios.post(`${BASE_URL}/orders/generate`, {
            includeAll: false // Only items needing reorder
        });
        const { ordersByVendor, totalItems, totalCost, urgentItems } = response.data;

        log(`✅ Order report generated`, colors.green);
        log(`   Total items: ${totalItems}`, colors.green);
        log(`   Total cost: $${totalCost}`, colors.green);
        log(`   Urgent items: ${urgentItems.length}`, colors.red);
        log(`   Vendors: ${ordersByVendor.length}`, colors.green);

        ordersByVendor.forEach(vendor => {
            log(`\n   ${vendor.vendor}:`, colors.magenta);
            log(`     Items: ${vendor.itemCount}`, colors.magenta);
            log(`     Cost: $${vendor.totalCost.toFixed(2)}`, colors.magenta);
        });

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testSendOrderEmail() {
    if (!config.runEmailTests) {
        log('\n📧 Skipping: Send order email test (disabled in config)', colors.yellow);
        return true;
    }

    log('\n📧 Testing: Send automatic order email', colors.blue);
    try {
        const response = await axios.post(`${BASE_URL}/orders/send`, {});
        const result = response.data;

        if (result.success) {
            log(`✅ Order email sent successfully!`, colors.green);
            log(`   ${result.message}`, colors.green);
            log(`   Items: ${result.details.itemCount}`, colors.green);
            log(`   Vendors: ${result.details.vendors.join(', ')}`, colors.green);
        } else {
            log(`⚠️  ${result.message}`, colors.yellow);
        }

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testAutomaticCheck() {
    log('\n🤖 Testing: Trigger automatic inventory check', colors.blue);
    try {
        const response = await axios.post(`${BASE_URL}/check/automatic`);
        const result = response.data;

        log(`✅ Automatic check completed`, colors.green);
        log(`   ${result.message}`, colors.green);
        log(`   Timestamp: ${result.timestamp}`, colors.green);

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testUpdatePARLevels() {
    log('\n📈 Testing: Update PAR levels', colors.blue);
    try {
        const itemId = 'HE001';
        const updateData = {
            parLevel: 5,
            reorderPoint: 3,
            reorderQuantity: 10
        };

        const response = await axios.put(`${BASE_URL}/${itemId}/par-levels`, updateData);
        const result = response.data;

        log(`✅ PAR levels updated`, colors.green);
        log(`   Item: ${result.item.name}`, colors.green);
        log(`   New PAR: ${result.item.parLevel}`, colors.green);
        log(`   New Reorder Point: ${result.item.reorderPoint}`, colors.green);
        log(`   New Order Qty: ${result.item.reorderQuantity}`, colors.green);

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

async function testInventoryStats() {
    log('\n📊 Testing: Get inventory statistics', colors.blue);
    try {
        const response = await axios.get(`${BASE_URL}/stats/overview`);
        const stats = response.data;

        log(`✅ Statistics retrieved`, colors.green);
        log(`   Total items: ${stats.totalItems}`, colors.green);
        log(`   Total value: $${stats.totalValue}`, colors.green);
        log(`   Need attention: ${stats.needsAttention}`, colors.yellow);

        log(`\n   Stock Status:`, colors.blue);
        Object.entries(stats.stockStatus).forEach(([status, count]) => {
            const color = status === 'critical' ? colors.red :
                         status === 'lowStock' ? colors.yellow :
                         colors.green;
            log(`     ${status}: ${count}`, color);
        });

        return true;
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    log('\n' + '='.repeat(60), colors.magenta);
    log('🧪 LARGO LAB INVENTORY MANAGEMENT SYSTEM TEST SUITE', colors.magenta);
    log('='.repeat(60), colors.magenta);

    const tests = [
        { name: 'Get Inventory', fn: testGetInventory },
        { name: 'Get Single Item', fn: testGetSingleItem },
        { name: 'Update Stock', fn: testUpdateStock },
        { name: 'Get Reorder Alerts', fn: testGetReorderAlerts },
        { name: 'Get Expiring Items', fn: testGetExpiringItems },
        { name: 'Generate Order Report', fn: testGenerateOrderReport },
        { name: 'Update PAR Levels', fn: testUpdatePARLevels },
        { name: 'Get Statistics', fn: testInventoryStats },
        { name: 'Automatic Check', fn: testAutomaticCheck },
        { name: 'Send Order Email', fn: testSendOrderEmail }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await test.fn();
            if (result) passed++;
            else failed++;
            await sleep(config.testDelay);
        } catch (error) {
            failed++;
            log(`\n❌ Test "${test.name}" crashed: ${error.message}`, colors.red);
        }
    }

    // Summary
    log('\n' + '='.repeat(60), colors.magenta);
    log('📊 TEST RESULTS SUMMARY', colors.magenta);
    log('='.repeat(60), colors.magenta);
    log(`✅ Passed: ${passed}/${tests.length}`, colors.green);
    if (failed > 0) {
        log(`❌ Failed: ${failed}/${tests.length}`, colors.red);
    }

    const successRate = ((passed / tests.length) * 100).toFixed(1);
    const rateColor = successRate >= 80 ? colors.green :
                     successRate >= 60 ? colors.yellow :
                     colors.red;
    log(`📈 Success Rate: ${successRate}%`, rateColor);

    log('\n' + '='.repeat(60), colors.magenta);
    log('🏁 TEST SUITE COMPLETED', colors.magenta);
    log('='.repeat(60) + '\n', colors.magenta);

    // Additional information
    if (!config.runEmailTests) {
        log('ℹ️  Note: Email tests were skipped. Set config.runEmailTests = true to test email functionality.', colors.yellow);
    }

    log('\n💡 Next Steps:', colors.blue);
    log('1. Start the server: npm start', colors.blue);
    log('2. Access the portal: http://localhost:3000', colors.blue);
    log('3. Navigate to inventory: Click "Inventory Management System" in Operations Command Center', colors.blue);
    log('4. Monitor automatic orders: Emails sent at 7 AM and 3 PM daily', colors.blue);
    log('5. Critical alerts: Sent every 4 hours for items at zero stock\n', colors.blue);
}

// Check if server is running before tests
async function checkServer() {
    try {
        await axios.get('http://localhost:3000/health');
        return true;
    } catch (error) {
        log('⚠️  Server is not running at http://localhost:3000', colors.red);
        log('Please start the server first: npm start\n', colors.yellow);
        return false;
    }
}

// Run tests
(async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runAllTests();
    } else {
        process.exit(1);
    }
})();