/**
 * Workflow Automation Engine
 * Automated test routing, result validation, critical value alerts, and batch processing
 */

class WorkflowAutomation {
  constructor() {
    this.workflows = new Map();
    this.activeProcesses = new Map();
    this.rules = [];
    this.init();
  }

  init() {
    this.registerDefaultWorkflows();
    this.registerAutomationRules();
    this.startAutomationEngine();
  }

  registerDefaultWorkflows() {
    // Critical Value Alert Workflow
    this.workflows.set('critical-value-alert', {
      name: 'Critical Value Alert',
      trigger: 'result-received',
      steps: [
        { action: 'validate-result', config: { requireSecondCheck: true } },
        { action: 'check-critical-ranges', config: {} },
        { action: 'notify-provider', config: { urgency: 'high' } },
        { action: 'document-acknowledgment', config: {} },
        { action: 'escalate-if-unacknowledged', config: { timeoutMinutes: 15 } }
      ],
      priority: 'critical'
    });

    // Automated Test Routing
    this.workflows.set('test-routing', {
      name: 'Automated Test Routing',
      trigger: 'order-received',
      steps: [
        { action: 'validate-order', config: {} },
        { action: 'determine-department', config: {} },
        { action: 'assign-to-analyzer', config: {} },
        { action: 'queue-for-processing', config: {} },
        { action: 'notify-staff', config: {} }
      ],
      priority: 'normal'
    });

    // QC Auto-Validation
    this.workflows.set('qc-validation', {
      name: 'QC Auto-Validation',
      trigger: 'qc-result-received',
      steps: [
        { action: 'check-control-limits', config: {} },
        { action: 'evaluate-trends', config: { lookbackDays: 7 } },
        { action: 'flag-out-of-range', config: {} },
        { action: 'initiate-corrective-action', config: {} },
        { action: 'document-results', config: {} }
      ],
      priority: 'high'
    });

    // Inventory Auto-Reorder
    this.workflows.set('inventory-reorder', {
      name: 'Inventory Auto-Reorder',
      trigger: 'inventory-check',
      steps: [
        { action: 'check-par-levels', config: {} },
        { action: 'calculate-reorder-quantity', config: {} },
        { action: 'generate-purchase-order', config: {} },
        { action: 'send-order-email', config: {} },
        { action: 'update-inventory-log', config: {} }
      ],
      priority: 'normal'
    });

    // Scheduled Maintenance Workflow
    this.workflows.set('scheduled-maintenance', {
      name: 'Scheduled Equipment Maintenance',
      trigger: 'maintenance-due',
      steps: [
        { action: 'notify-staff', config: { advanceDays: 2 } },
        { action: 'create-maintenance-task', config: {} },
        { action: 'prepare-materials', config: {} },
        { action: 'lock-equipment', config: {} },
        { action: 'document-completion', config: {} }
      ],
      priority: 'high'
    });
  }

  registerAutomationRules() {
    // Critical Value Rule
    this.rules.push({
      id: 'critical-value-detection',
      name: 'Critical Value Detection',
      condition: (data) => this.isCriticalValue(data),
      action: (data) => this.triggerWorkflow('critical-value-alert', data),
      enabled: true
    });

    // Auto QC Validation Rule
    this.rules.push({
      id: 'auto-qc-validation',
      name: 'Automatic QC Validation',
      condition: (data) => data.type === 'qc-result',
      action: (data) => this.triggerWorkflow('qc-validation', data),
      enabled: true
    });

    // Inventory Low Stock Rule
    this.rules.push({
      id: 'inventory-low-stock',
      name: 'Inventory Low Stock Alert',
      condition: (data) => data.quantity <= data.parLevel * 0.3,
      action: (data) => this.triggerWorkflow('inventory-reorder', data),
      enabled: true
    });

    // Equipment Maintenance Due Rule
    this.rules.push({
      id: 'maintenance-due-reminder',
      name: 'Maintenance Due Reminder',
      condition: (data) => this.isMaintenanceDue(data),
      action: (data) => this.triggerWorkflow('scheduled-maintenance', data),
      enabled: true
    });
  }

  startAutomationEngine() {
    // Check for scheduled tasks every minute
    setInterval(() => {
      this.processScheduledTasks();
    }, 60000);

    // Process batch operations every 5 minutes
    setInterval(() => {
      this.processBatchOperations();
    }, 300000);

    console.log('[Automation] Workflow automation engine started');
  }

  async processEvent(eventType, eventData) {
    // Check all rules against the event
    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      try {
        if (rule.condition(eventData)) {
          console.log(`[Automation] Rule triggered: ${rule.name}`);
          await rule.action(eventData);
        }
      } catch (error) {
        console.error(`[Automation] Rule error (${rule.id}):`, error);
      }
    }
  }

  async triggerWorkflow(workflowId, data) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      console.error(`[Automation] Workflow not found: ${workflowId}`);
      return;
    }

    const processId = `${workflowId}-${Date.now()}`;

    const process = {
      id: processId,
      workflow: workflowId,
      status: 'running',
      currentStep: 0,
      data: data,
      startedAt: new Date(),
      completedSteps: [],
      errors: []
    };

    this.activeProcesses.set(processId, process);

    console.log(`[Automation] Starting workflow: ${workflow.name}`);

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        process.currentStep = i;

        console.log(`[Automation] Executing step ${i + 1}/${workflow.steps.length}: ${step.action}`);

        const result = await this.executeStep(step, data);

        process.completedSteps.push({
          step: i,
          action: step.action,
          result: result,
          completedAt: new Date()
        });
      }

      process.status = 'completed';
      process.completedAt = new Date();

      console.log(`[Automation] Workflow completed: ${workflow.name}`);

      return {
        success: true,
        processId: processId,
        workflow: workflow.name
      };
    } catch (error) {
      process.status = 'failed';
      process.errors.push({
        step: process.currentStep,
        error: error.message,
        timestamp: new Date()
      });

      console.error(`[Automation] Workflow failed: ${workflow.name}`, error);

      return {
        success: false,
        processId: processId,
        error: error.message
      };
    }
  }

  async executeStep(step, data) {
    switch (step.action) {
      case 'validate-result':
        return this.validateResult(data, step.config);

      case 'check-critical-ranges':
        return this.checkCriticalRanges(data, step.config);

      case 'notify-provider':
        return this.notifyProvider(data, step.config);

      case 'document-acknowledgment':
        return this.documentAcknowledgment(data, step.config);

      case 'check-par-levels':
        return this.checkParLevels(data, step.config);

      case 'send-order-email':
        return this.sendOrderEmail(data, step.config);

      case 'notify-staff':
        return this.notifyStaff(data, step.config);

      default:
        console.log(`[Automation] Simulated action: ${step.action}`);
        return { success: true, action: step.action };
    }
  }

  // Helper methods for workflow actions

  async validateResult(data, config) {
    // Simulate result validation
    console.log('[Automation] Validating result...');
    return { valid: true, requiresSecondCheck: config.requireSecondCheck };
  }

  async checkCriticalRanges(data, config) {
    const isCritical = this.isCriticalValue(data);
    if (isCritical) {
      this.showCriticalAlert(data);
    }
    return { isCritical };
  }

  async notifyProvider(data, config) {
    console.log(`[Automation] Notifying provider (urgency: ${config.urgency})`);

    // Show notification
    if (window.NotificationManager) {
      const notification = new NotificationManager();
      notification.show(
        'error',
        'Critical Value Alert',
        `Critical result detected: ${data.testName || 'Unknown Test'}`
      );
    }

    return { notified: true, urgency: config.urgency };
  }

  async documentAcknowledgment(data, config) {
    console.log('[Automation] Documenting acknowledgment...');
    // Store acknowledgment in localStorage
    const ackLog = JSON.parse(localStorage.getItem('critical-ack-log') || '[]');
    ackLog.push({
      timestamp: new Date().toISOString(),
      test: data.testName,
      value: data.value,
      acknowledgedBy: 'Automated System'
    });
    localStorage.setItem('critical-ack-log', JSON.stringify(ackLog));

    return { documented: true };
  }

  async checkParLevels(data, config) {
    const isBelowPar = data.quantity < data.parLevel;
    return {
      isBelowPar,
      currentQuantity: data.quantity,
      parLevel: data.parLevel,
      reorderNeeded: isBelowPar
    };
  }

  async sendOrderEmail(data, config) {
    console.log('[Automation] Sending order email...');
    // In production, this would call an API endpoint
    return { emailSent: true, orderNumber: `ORD-${Date.now()}` };
  }

  async notifyStaff(data, config) {
    console.log('[Automation] Notifying staff...');

    if (window.NotificationManager) {
      const notification = new NotificationManager();
      notification.show('info', 'Staff Notification', data.message || 'Task requires attention');
    }

    return { notified: true };
  }

  // Utility methods

  isCriticalValue(data) {
    // Define critical ranges for common tests
    const criticalRanges = {
      Glucose: { low: 40, high: 400 },
      Potassium: { low: 2.5, high: 6.5 },
      Sodium: { low: 120, high: 160 },
      Calcium: { low: 6.0, high: 13.0 },
      WBC: { low: 2.0, high: 30.0 },
      Hemoglobin: { low: 5.0, high: 20.0 }
    };

    const range = criticalRanges[data.testName];
    if (!range) return false;

    return data.value < range.low || data.value > range.high;
  }

  showCriticalAlert(data) {
    if (window.NotificationManager) {
      const notification = new NotificationManager();
      notification.show(
        'error',
        'CRITICAL VALUE ALERT',
        `${data.testName}: ${data.value} ${data.unit || ''} - Immediate action required`
      );
    }
  }

  isMaintenanceDue(data) {
    if (!data.lastMaintenance || !data.maintenanceInterval) return false;

    const lastDate = new Date(data.lastMaintenance);
    const now = new Date();
    const daysSince = (now - lastDate) / (1000 * 60 * 60 * 24);

    return daysSince >= data.maintenanceInterval;
  }

  async processScheduledTasks() {
    // Process tasks scheduled for this time
    console.log('[Automation] Processing scheduled tasks...');

    // Check inventory levels
    this.checkAllInventoryLevels();

    // Check equipment maintenance
    this.checkEquipmentMaintenance();
  }

  async processBatchOperations() {
    console.log('[Automation] Processing batch operations...');

    // Batch process QC results
    // Batch process pending orders
    // etc.
  }

  async checkAllInventoryLevels() {
    // In production, fetch from API
    const mockInventory = [
      { item: 'Blood Collection Tubes', quantity: 150, parLevel: 500 },
      { item: 'Reagent Kit A', quantity: 80, parLevel: 100 },
      { item: 'Control Material', quantity: 25, parLevel: 50 }
    ];

    for (const item of mockInventory) {
      if (item.quantity <= item.parLevel * 0.3) {
        await this.processEvent('inventory-check', item);
      }
    }
  }

  async checkEquipmentMaintenance() {
    // In production, fetch from database
    const mockEquipment = [
      {
        name: 'Chemistry Analyzer',
        lastMaintenance: '2025-10-15',
        maintenanceInterval: 30
      }
    ];

    for (const equipment of mockEquipment) {
      if (this.isMaintenanceDue(equipment)) {
        await this.processEvent('maintenance-due', equipment);
      }
    }
  }

  // Public API methods

  getActiveProcesses() {
    return Array.from(this.activeProcesses.values());
  }

  getProcessStatus(processId) {
    return this.activeProcesses.get(processId);
  }

  getWorkflows() {
    return Array.from(this.workflows.entries()).map(([id, workflow]) => ({
      id,
      ...workflow
    }));
  }

  getRules() {
    return this.rules;
  }

  toggleRule(ruleId, enabled) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
      console.log(`[Automation] Rule ${ruleId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// Initialize and export
const workflowAutomation = new WorkflowAutomation();
window.workflowAutomation = workflowAutomation;

// Expose for debugging
window.testCriticalValue = () => {
  workflowAutomation.processEvent('result-received', {
    testName: 'Potassium',
    value: 7.2,
    unit: 'mmol/L',
    patientId: 'TEST-001'
  });
};

window.testInventoryReorder = () => {
  workflowAutomation.processEvent('inventory-check', {
    item: 'Blood Collection Tubes',
    quantity: 100,
    parLevel: 500
  });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkflowAutomation;
}
