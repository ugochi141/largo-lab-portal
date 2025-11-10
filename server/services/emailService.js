/**
 * Email Service for Inventory Management
 * Handles automatic ordering emails when items reach reorder points
 * Kaiser Permanente Largo Laboratory
 */

const nodemailer = require('nodemailer');
const cron = require('node-cron');

class EmailService {
    constructor() {
        // Configure email transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.kp.org',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'largo-lab-portal@kp.org',
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Email recipients configuration
        this.recipients = {
            to: [
                'LargoInventoryTeam@KP.org',
                'Alex.X.Roberson@kp.org',
                'Tianna.J.Maxwell@kp.org'
            ],
            cc: [
                'John.F.Ekpe@kp.org',
                'Ugochi.L.Ndubuisi@kp.org',
                'Shanthi.A.Hayes@kp.org',
                'Emily.D.Creekmore@kp.org',
                'Maxwell.L.Booker@kp.org',
                'George.T.Etape@kp.org'
            ]
        };

        // Schedule automatic inventory checks
        this.scheduleInventoryChecks();
    }

    /**
     * Schedule automatic inventory checks
     * Runs every day at 7 AM and 3 PM
     */
    scheduleInventoryChecks() {
        // Check inventory at 7 AM
        cron.schedule('0 7 * * *', async () => {
            console.log('Running morning inventory check...');
            await this.checkAndOrderInventory();
        });

        // Check inventory at 3 PM
        cron.schedule('0 15 * * *', async () => {
            console.log('Running afternoon inventory check...');
            await this.checkAndOrderInventory();
        });

        // Critical check every 4 hours
        cron.schedule('0 */4 * * *', async () => {
            console.log('Running critical inventory check...');
            await this.checkCriticalItems();
        });

        console.log('Inventory checking schedule initialized');
    }

    /**
     * Check inventory and automatically send order emails
     */
    async checkAndOrderInventory() {
        try {
            // Get inventory data
            const inventoryData = await this.getInventoryData();
            const itemsToOrder = inventoryData.supplies.filter(
                item => item.currentStock <= item.reorderPoint
            );

            if (itemsToOrder.length === 0) {
                console.log('No items need ordering');
                return;
            }

            // Group items by vendor
            const ordersByVendor = this.groupItemsByVendor(itemsToOrder);

            // Send order email
            await this.sendOrderEmail(ordersByVendor, itemsToOrder);

            // Log the automatic order
            global.logger.info('Automatic inventory order sent', {
                itemCount: itemsToOrder.length,
                vendors: Object.keys(ordersByVendor),
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error in automatic inventory ordering:', error);
            global.logger.error('Automatic inventory ordering failed', { error: error.message });
        }
    }

    /**
     * Check for critical items only
     */
    async checkCriticalItems() {
        try {
            const inventoryData = await this.getInventoryData();
            const criticalItems = inventoryData.supplies.filter(
                item => item.status === 'Critical - Order Now' ||
                       item.currentStock === 0
            );

            if (criticalItems.length > 0) {
                await this.sendCriticalAlertEmail(criticalItems);
            }
        } catch (error) {
            console.error('Error checking critical items:', error);
        }
    }

    /**
     * Send order email
     */
    async sendOrderEmail(ordersByVendor, itemsToOrder) {
        const orderDate = new Date().toISOString().split('T')[0];
        const orderNumber = `PO-${orderDate}-${Date.now().toString().slice(-6)}`;

        // Calculate total cost
        const totalCost = itemsToOrder.reduce(
            (sum, item) => sum + (item.reorderQuantity * item.unitPrice), 0
        ).toFixed(2);

        // Create HTML email body
        const emailBody = this.generateOrderEmailHTML(
            orderNumber,
            ordersByVendor,
            itemsToOrder,
            totalCost
        );

        const mailOptions = {
            from: '"Largo Lab Portal" <largo-lab-portal@kp.org>',
            to: this.recipients.to.join(', '),
            cc: this.recipients.cc.join(', '),
            subject: `[AUTOMATED] Laboratory Supply Order ${orderNumber} - ${itemsToOrder.length} Items`,
            html: emailBody,
            attachments: [
                {
                    filename: `order_${orderNumber}.csv`,
                    content: this.generateOrderCSV(itemsToOrder)
                }
            ]
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Order email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Failed to send order email:', error);
            throw error;
        }
    }

    /**
     * Send critical alert email
     */
    async sendCriticalAlertEmail(criticalItems) {
        const emailBody = this.generateCriticalAlertHTML(criticalItems);

        const mailOptions = {
            from: '"Largo Lab Portal URGENT" <largo-lab-portal@kp.org>',
            to: this.recipients.to.join(', '),
            cc: this.recipients.cc.join(', '),
            subject: `[URGENT] Critical Inventory Alert - ${criticalItems.length} Items Need Immediate Attention`,
            priority: 'high',
            html: emailBody
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Critical alert sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Failed to send critical alert:', error);
            throw error;
        }
    }

    /**
     * Generate HTML for order email
     */
    generateOrderEmailHTML(orderNumber, ordersByVendor, items, totalCost) {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #005EB8; color: white; padding: 20px; }
        .content { padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th { background-color: #005EB8; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .vendor-section { margin: 30px 0; }
        .vendor-header { background-color: #f4f4f4; padding: 10px; font-weight: bold; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        .footer { margin-top: 30px; padding: 20px; background-color: #f4f4f4; font-size: 12px; }
        .urgent { color: #dc3545; font-weight: bold; }
        .warning { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Kaiser Permanente Largo Laboratory</h1>
        <h2>Automated Supply Order ${orderNumber}</h2>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div class="content">
        <div class="warning">
            <strong>⚠️ Automatic Order Generated</strong><br>
            This order was automatically generated because the following items have reached or fallen below their reorder points.
        </div>

        <h3>Order Summary</h3>
        <ul>
            <li><strong>Total Items:</strong> ${items.length}</li>
            <li><strong>Number of Vendors:</strong> ${Object.keys(ordersByVendor).length}</li>
            <li><strong>Estimated Total Cost:</strong> $${totalCost}</li>
            <li><strong>Critical Items:</strong> ${items.filter(i => i.status === 'Critical - Order Now').length}</li>
        </ul>

        ${Object.entries(ordersByVendor).map(([vendor, data]) => `
        <div class="vendor-section">
            <div class="vendor-header">
                ${vendor} - ${data.items.length} items - Total: $${data.totalCost.toFixed(2)}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Catalog #</th>
                        <th>Current Stock</th>
                        <th>Reorder Point</th>
                        <th>Order Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.catalogNumber}</td>
                        <td>${item.currentStock}</td>
                        <td>${item.reorderPoint}</td>
                        <td><strong>${item.orderQuantity}</strong></td>
                        <td>$${item.unitPrice.toFixed(2)}</td>
                        <td>$${item.estimatedCost.toFixed(2)}</td>
                        <td class="${item.status === 'Critical - Order Now' ? 'urgent' : ''}">${item.status}</td>
                    </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="7">Vendor Total:</td>
                        <td>$${data.totalCost.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        `).join('')}

        <h3>Action Required</h3>
        <ol>
            <li>Review the attached CSV file for complete order details</li>
            <li>Contact vendors to place orders</li>
            <li>Update the inventory system when orders are placed</li>
            <li>Monitor delivery and update stock upon receipt</li>
        </ol>

        <h3>Notes</h3>
        <ul>
            <li>Items marked as "Critical - Order Now" require immediate attention</li>
            <li>Consider expedited shipping for critical items</li>
            <li>Verify current stock levels before finalizing orders</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>Largo Clinical Core Laboratory</strong></p>
        <p>9900 Medical Center Drive | Largo, MD 20774</p>
        <p>This is an automated message from the Largo Laboratory Portal Inventory Management System.</p>
        <p>For questions, contact the Laboratory IT Support Team.</p>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate critical alert HTML
     */
    generateCriticalAlertHTML(items) {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #dc3545; color: white; padding: 20px; }
        .content { padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th { background-color: #dc3545; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .urgent { color: #dc3545; font-weight: bold; }
        .out-of-stock { background-color: #ffebee; }
        .alert-box { background-color: #ffebee; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚠️ URGENT: Critical Inventory Alert</h1>
        <h2>Immediate Action Required</h2>
    </div>

    <div class="content">
        <div class="alert-box">
            <h3>🚨 Critical Situation Detected</h3>
            <p>The following ${items.length} items require immediate attention. Some items may be completely out of stock or critically low.</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Current Stock</th>
                    <th>Reorder Point</th>
                    <th>Location</th>
                    <th>Vendor</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr class="${item.currentStock === 0 ? 'out-of-stock' : ''}">
                    <td><strong>${item.name}</strong></td>
                    <td class="urgent">${item.currentStock}</td>
                    <td>${item.reorderPoint}</td>
                    <td>${item.location}</td>
                    <td>${item.vendor}</td>
                    <td class="urgent">${item.status}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <h3>Immediate Actions Required:</h3>
        <ol>
            <li>Contact vendors immediately for expedited orders</li>
            <li>Check for alternative suppliers if primary vendor cannot deliver quickly</li>
            <li>Notify laboratory staff about potential shortages</li>
            <li>Consider borrowing from other Kaiser facilities if critical</li>
        </ol>
    </div>
</body>
</html>
        `;
    }

    /**
     * Generate CSV file content for order
     */
    generateOrderCSV(items) {
        const headers = [
            'Item ID',
            'Item Name',
            'Category',
            'Catalog Number',
            'Vendor',
            'Current Stock',
            'PAR Level',
            'Reorder Point',
            'Order Quantity',
            'Unit of Measure',
            'Unit Price',
            'Total Cost',
            'Location',
            'Status',
            'Notes'
        ].join(',');

        const rows = items.map(item => [
            item.id,
            `"${item.name}"`,
            `"${item.category}"`,
            item.catalogNumber,
            `"${item.vendor}"`,
            item.currentStock,
            item.parLevel,
            item.reorderPoint,
            item.reorderQuantity,
            `"${item.unitOfMeasure}"`,
            item.unitPrice,
            (item.reorderQuantity * item.unitPrice).toFixed(2),
            `"${item.location}"`,
            `"${item.status}"`,
            `"${item.notes || ''}"`
        ].join(','));

        return [headers, ...rows].join('\n');
    }

    /**
     * Group items by vendor
     */
    groupItemsByVendor(items) {
        const ordersByVendor = {};

        items.forEach(item => {
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

        return ordersByVendor;
    }

    /**
     * Get current inventory data
     * In production, this would fetch from database
     */
    async getInventoryData() {
        // This would normally fetch from database
        // For now, return the mock data from inventory.js
        const inventoryModule = require('../routes/inventory');
        return global.inventoryData || require('../routes/inventory').inventoryData;
    }

    /**
     * Manually trigger an order email (for testing or manual orders)
     */
    async manualOrder(itemIds = null) {
        try {
            const inventoryData = await this.getInventoryData();
            let itemsToOrder;

            if (itemIds) {
                itemsToOrder = inventoryData.supplies.filter(item => itemIds.includes(item.id));
            } else {
                itemsToOrder = inventoryData.supplies.filter(
                    item => item.currentStock <= item.reorderPoint
                );
            }

            if (itemsToOrder.length === 0) {
                return { success: false, message: 'No items to order' };
            }

            const ordersByVendor = this.groupItemsByVendor(itemsToOrder);
            await this.sendOrderEmail(ordersByVendor, itemsToOrder);

            return {
                success: true,
                message: `Order email sent for ${itemsToOrder.length} items`,
                itemCount: itemsToOrder.length,
                vendors: Object.keys(ordersByVendor)
            };
        } catch (error) {
            console.error('Manual order failed:', error);
            return {
                success: false,
                message: 'Failed to send order email',
                error: error.message
            };
        }
    }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;