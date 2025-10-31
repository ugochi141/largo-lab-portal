/**
 * Inventory Management Routes
 * Handles laboratory supplies, reagents, and equipment inventory
 * Kaiser Permanente Largo Laboratory
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');

// Mock inventory database (in production, use real database)
// This would be populated from Excel files
let inventoryData = {
    supplies: [],
    lastUpdated: null,
    categories: [],
    locations: [],
    vendors: []
};

// Export for email service
global.inventoryData = inventoryData;

// Load inventory data from JSON file (converted from Excel)
const loadInventoryData = async () => {
    try {
        const dataPath = path.join(__dirname, '../../data/inventory.json');
        const data = await fs.readFile(dataPath, 'utf8');
        inventoryData = JSON.parse(data);
        global.logger.info('Inventory data loaded successfully');
    } catch (error) {
        global.logger.error('Failed to load inventory data', { error: error.message });
        // Use default mock data if file doesn't exist
        inventoryData = generateMockInventory();
    }
};

// Generate mock inventory for testing
const generateMockInventory = () => {
    return {
        lastUpdated: new Date().toISOString(),
        categories: [
            'Chemistry Reagents',
            'Hematology Supplies',
            'Microbiology Media',
            'Phlebotomy Supplies',
            'PPE',
            'General Lab Supplies',
            'Quality Control Materials',
            'Maintenance Supplies'
        ],
        locations: [
            'Main Lab - Chemistry',
            'Main Lab - Hematology',
            'Main Lab - Microbiology',
            'Phlebotomy Station',
            'Storage Room A',
            'Storage Room B',
            'Refrigerator 1',
            'Refrigerator 2',
            'Freezer -20°C',
            'Freezer -80°C'
        ],
        vendors: [
            'Fisher Scientific',
            'VWR International',
            'Bio-Rad',
            'Beckman Coulter',
            'Roche Diagnostics',
            'Abbott Laboratories',
            'Thermo Fisher',
            'BD Biosciences'
        ],
        supplies: [
            {
                id: 'SUP001',
                name: 'BD Vacutainer SST Tubes',
                category: 'Phlebotomy Supplies',
                description: 'Serum separator tubes, gold top',
                catalogNumber: 'BD367989',
                vendor: 'BD Biosciences',
                unitOfMeasure: 'Box (100 tubes)',
                currentStock: 45,
                parLevel: 50,
                reorderPoint: 20,
                reorderQuantity: 30,
                location: 'Phlebotomy Station',
                expirationDate: '2026-03-15',
                lotNumber: 'LOT123456',
                unitPrice: 85.50,
                status: 'In Stock',
                lastOrdered: '2025-09-15',
                lastReceived: '2025-09-25',
                notes: 'High usage item'
            },
            {
                id: 'SUP002',
                name: 'EDTA K2 Tubes',
                category: 'Phlebotomy Supplies',
                description: 'Lavender top tubes for hematology',
                catalogNumber: 'BD367863',
                vendor: 'BD Biosciences',
                unitOfMeasure: 'Box (100 tubes)',
                currentStock: 38,
                parLevel: 40,
                reorderPoint: 15,
                reorderQuantity: 25,
                location: 'Phlebotomy Station',
                expirationDate: '2026-04-20',
                lotNumber: 'LOT789012',
                unitPrice: 78.25,
                status: 'In Stock',
                lastOrdered: '2025-09-10',
                lastReceived: '2025-09-20',
                notes: 'For CBC and blood bank'
            },
            {
                id: 'SUP003',
                name: 'Chemistry Control Level 1',
                category: 'Quality Control Materials',
                description: 'Normal level chemistry control',
                catalogNumber: 'BIO123',
                vendor: 'Bio-Rad',
                unitOfMeasure: 'Box (25 vials)',
                currentStock: 8,
                parLevel: 10,
                reorderPoint: 5,
                reorderQuantity: 10,
                location: 'Refrigerator 1',
                expirationDate: '2025-12-31',
                lotNumber: 'QC456789',
                unitPrice: 325.00,
                status: 'Low Stock',
                lastOrdered: '2025-08-01',
                lastReceived: '2025-08-10',
                notes: 'Store at 2-8°C'
            },
            {
                id: 'SUP004',
                name: 'Nitrile Gloves - Medium',
                category: 'PPE',
                description: 'Powder-free nitrile examination gloves',
                catalogNumber: 'VWR89038-270',
                vendor: 'VWR International',
                unitOfMeasure: 'Box (100 gloves)',
                currentStock: 120,
                parLevel: 100,
                reorderPoint: 50,
                reorderQuantity: 100,
                location: 'Storage Room A',
                expirationDate: '2028-12-31',
                lotNumber: 'GLV2025',
                unitPrice: 12.50,
                status: 'In Stock',
                lastOrdered: '2025-10-01',
                lastReceived: '2025-10-10',
                notes: 'High usage PPE'
            },
            {
                id: 'SUP005',
                name: 'Glucose Reagent',
                category: 'Chemistry Reagents',
                description: 'Glucose hexokinase reagent',
                catalogNumber: 'ROCHE123',
                vendor: 'Roche Diagnostics',
                unitOfMeasure: 'Kit (500 tests)',
                currentStock: 3,
                parLevel: 5,
                reorderPoint: 2,
                reorderQuantity: 5,
                location: 'Main Lab - Chemistry',
                expirationDate: '2026-01-15',
                lotNumber: 'GLU98765',
                unitPrice: 450.00,
                status: 'Critical - Order Now',
                lastOrdered: '2025-09-01',
                lastReceived: '2025-09-08',
                notes: 'High volume test'
            }
        ]
    };
};

// Initialize inventory data on startup
loadInventoryData();

// Get all inventory items
router.get('/', asyncHandler(async (req, res) => {
    const { category, location, status, search } = req.query;

    let filteredSupplies = [...inventoryData.supplies];

    // Apply filters
    if (category) {
        filteredSupplies = filteredSupplies.filter(
            item => item.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (location) {
        filteredSupplies = filteredSupplies.filter(
            item => item.location.toLowerCase() === location.toLowerCase()
        );
    }

    if (status) {
        filteredSupplies = filteredSupplies.filter(
            item => item.status.toLowerCase() === status.toLowerCase()
        );
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredSupplies = filteredSupplies.filter(
            item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower) ||
                item.catalogNumber.toLowerCase().includes(searchLower)
        );
    }

    // Calculate statistics
    const stats = calculateInventoryStats(filteredSupplies);

    res.json({
        supplies: filteredSupplies,
        count: filteredSupplies.length,
        stats: stats,
        categories: inventoryData.categories,
        locations: inventoryData.locations,
        vendors: inventoryData.vendors,
        lastUpdated: inventoryData.lastUpdated
    });
}));

// Get single inventory item
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const item = inventoryData.supplies.find(s => s.id === id);

    if (!item) {
        throw new AppError('Inventory item not found', 404);
    }

    // Calculate additional details
    const stockPercentage = (item.currentStock / item.parLevel) * 100;
    const daysUntilExpiration = item.expirationDate ?
        Math.floor((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

    res.json({
        ...item,
        stockPercentage: stockPercentage.toFixed(1),
        daysUntilExpiration,
        needsReorder: item.currentStock <= item.reorderPoint
    });
}));

// Update inventory item stock
router.patch('/:id/stock', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, operation, reason, lotNumber, expirationDate } = req.body;

    const item = inventoryData.supplies.find(s => s.id === id);

    if (!item) {
        throw new AppError('Inventory item not found', 404);
    }

    // Validate operation
    if (!['add', 'remove', 'adjust'].includes(operation)) {
        throw new AppError('Invalid operation. Must be add, remove, or adjust', 400);
    }

    const oldStock = item.currentStock;

    // Update stock based on operation
    if (operation === 'add') {
        item.currentStock += quantity;
        item.lastReceived = new Date().toISOString().split('T')[0];
        if (lotNumber) item.lotNumber = lotNumber;
        if (expirationDate) item.expirationDate = expirationDate;
    } else if (operation === 'remove') {
        if (quantity > item.currentStock) {
            throw new AppError('Insufficient stock', 400);
        }
        item.currentStock -= quantity;
    } else if (operation === 'adjust') {
        item.currentStock = quantity;
    }

    // Update status based on new stock level
    const oldStatus = item.status;
    if (item.currentStock <= 0) {
        item.status = 'Out of Stock';
    } else if (item.currentStock <= item.reorderPoint) {
        item.status = 'Critical - Order Now';
    } else if (item.currentStock < item.parLevel * 0.5) {
        item.status = 'Low Stock';
    } else {
        item.status = 'In Stock';
    }

    // Check if item has become critical and send immediate alert
    if (oldStatus !== 'Critical - Order Now' && item.status === 'Critical - Order Now') {
        // Send critical alert for this specific item
        emailService.sendCriticalAlertEmail([item]).catch(err => {
            global.logger.error('Failed to send critical alert', { error: err.message });
        });
    }

    // Log the transaction
    global.logger.info('Inventory stock updated', {
        itemId: id,
        itemName: item.name,
        operation,
        quantity,
        oldStock,
        newStock: item.currentStock,
        reason,
        user: req.user?.username || 'Unknown'
    });

    res.json({
        message: 'Stock updated successfully',
        item,
        transaction: {
            operation,
            quantity,
            oldStock,
            newStock: item.currentStock,
            timestamp: new Date().toISOString()
        }
    });
}));

// Get items needing reorder
router.get('/alerts/reorder', asyncHandler(async (req, res) => {
    const itemsToReorder = inventoryData.supplies.filter(
        item => item.currentStock <= item.reorderPoint
    );

    const criticalItems = itemsToReorder.filter(
        item => item.currentStock <= item.reorderPoint * 0.5
    );

    res.json({
        itemsToReorder,
        criticalItems,
        totalItems: itemsToReorder.length,
        criticalCount: criticalItems.length,
        estimatedCost: itemsToReorder.reduce(
            (sum, item) => sum + (item.reorderQuantity * item.unitPrice), 0
        ).toFixed(2)
    });
}));

// Get expiring items
router.get('/alerts/expiring', asyncHandler(async (req, res) => {
    const daysAhead = parseInt(req.query.days) || 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    const expiringItems = inventoryData.supplies.filter(item => {
        if (!item.expirationDate) return false;
        const expDate = new Date(item.expirationDate);
        return expDate <= cutoffDate;
    });

    // Sort by expiration date
    expiringItems.sort((a, b) =>
        new Date(a.expirationDate) - new Date(b.expirationDate)
    );

    // Categorize by urgency
    const expired = expiringItems.filter(
        item => new Date(item.expirationDate) < new Date()
    );
    const within30Days = expiringItems.filter(item => {
        const daysUntil = Math.floor(
            (new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntil >= 0 && daysUntil <= 30;
    });

    res.json({
        expiringItems,
        expired,
        within30Days,
        totalExpiring: expiringItems.length,
        expiredCount: expired.length,
        urgentCount: within30Days.length
    });
}));

// Generate order report
router.post('/orders/generate', asyncHandler(async (req, res) => {
    const { includeAll } = req.body;

    const itemsToOrder = includeAll ?
        inventoryData.supplies :
        inventoryData.supplies.filter(item => item.currentStock <= item.reorderPoint);

    // Group by vendor
    const ordersByVendor = {};
    itemsToOrder.forEach(item => {
        if (!ordersByVendor[item.vendor]) {
            ordersByVendor[item.vendor] = {
                vendor: item.vendor,
                items: [],
                totalCost: 0,
                itemCount: 0
            };
        }

        const orderQty = item.reorderQuantity;
        const cost = orderQty * item.unitPrice;

        ordersByVendor[item.vendor].items.push({
            ...item,
            orderQuantity: orderQty,
            estimatedCost: cost
        });
        ordersByVendor[item.vendor].totalCost += cost;
        ordersByVendor[item.vendor].itemCount++;
    });

    const orderSummary = {
        generatedAt: new Date().toISOString(),
        ordersByVendor: Object.values(ordersByVendor),
        totalItems: itemsToOrder.length,
        totalCost: Object.values(ordersByVendor).reduce(
            (sum, vendor) => sum + vendor.totalCost, 0
        ).toFixed(2),
        urgentItems: itemsToOrder.filter(item => item.status === 'Critical - Order Now')
    };

    // Log order generation
    global.logger.info('Order report generated', {
        itemCount: orderSummary.totalItems,
        totalCost: orderSummary.totalCost,
        vendors: Object.keys(ordersByVendor),
        user: req.user?.username || 'Unknown'
    });

    res.json(orderSummary);
}));

// Get inventory statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
    const stats = calculateInventoryStats(inventoryData.supplies);

    res.json(stats);
}));

// Update PAR levels
router.put('/:id/par-levels', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { parLevel, reorderPoint, reorderQuantity } = req.body;

    const item = inventoryData.supplies.find(s => s.id === id);

    if (!item) {
        throw new AppError('Inventory item not found', 404);
    }

    // Validate inputs
    if (parLevel && parLevel <= 0) {
        throw new AppError('PAR level must be greater than 0', 400);
    }
    if (reorderPoint && reorderPoint <= 0) {
        throw new AppError('Reorder point must be greater than 0', 400);
    }
    if (reorderQuantity && reorderQuantity <= 0) {
        throw new AppError('Reorder quantity must be greater than 0', 400);
    }

    // Update values
    if (parLevel !== undefined) item.parLevel = parLevel;
    if (reorderPoint !== undefined) item.reorderPoint = reorderPoint;
    if (reorderQuantity !== undefined) item.reorderQuantity = reorderQuantity;

    // Re-evaluate status
    if (item.currentStock <= 0) {
        item.status = 'Out of Stock';
    } else if (item.currentStock <= item.reorderPoint) {
        item.status = 'Critical - Order Now';
    } else if (item.currentStock < item.parLevel * 0.5) {
        item.status = 'Low Stock';
    } else {
        item.status = 'In Stock';
    }

    global.logger.info('PAR levels updated', {
        itemId: id,
        itemName: item.name,
        parLevel: item.parLevel,
        reorderPoint: item.reorderPoint,
        reorderQuantity: item.reorderQuantity
    });

    res.json({
        message: 'PAR levels updated successfully',
        item
    });
}));

// Send manual order email
router.post('/orders/send', asyncHandler(async (req, res) => {
    const { itemIds } = req.body;

    try {
        const result = await emailService.manualOrder(itemIds);

        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                details: {
                    itemCount: result.itemCount,
                    vendors: result.vendors
                }
            });
        } else {
            throw new AppError(result.message, 400);
        }
    } catch (error) {
        throw new AppError('Failed to send order email', 500);
    }
}));

// Trigger automatic inventory check
router.post('/check/automatic', asyncHandler(async (req, res) => {
    try {
        await emailService.checkAndOrderInventory();

        res.json({
            success: true,
            message: 'Automatic inventory check completed',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        throw new AppError('Failed to run automatic check', 500);
    }
}));

// Helper function to calculate statistics
function calculateInventoryStats(supplies) {
    const totalItems = supplies.length;
    const totalValue = supplies.reduce(
        (sum, item) => sum + (item.currentStock * item.unitPrice), 0
    );

    const stockStatus = {
        inStock: supplies.filter(item => item.status === 'In Stock').length,
        lowStock: supplies.filter(item => item.status === 'Low Stock').length,
        critical: supplies.filter(item => item.status === 'Critical - Order Now').length,
        outOfStock: supplies.filter(item => item.status === 'Out of Stock').length
    };

    const categoryBreakdown = {};
    supplies.forEach(item => {
        if (!categoryBreakdown[item.category]) {
            categoryBreakdown[item.category] = {
                count: 0,
                value: 0,
                lowStock: 0
            };
        }
        categoryBreakdown[item.category].count++;
        categoryBreakdown[item.category].value += item.currentStock * item.unitPrice;
        if (item.currentStock <= item.reorderPoint) {
            categoryBreakdown[item.category].lowStock++;
        }
    });

    return {
        totalItems,
        totalValue: totalValue.toFixed(2),
        stockStatus,
        categoryBreakdown,
        needsAttention: stockStatus.critical + stockStatus.outOfStock,
        lastUpdated: inventoryData.lastUpdated
    };
}

module.exports = router;