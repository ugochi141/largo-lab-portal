/**
 * API Service for Backend Communication
 * Handles all HTTP requests to the Express backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  catalogNumber?: string;
  vendor?: string;
  currentStock: number;
  parLevel: number;
  reorderPoint: number;
  reorderQuantity?: number;
  location?: string;
  storageTemp?: string;
  unitPrice?: number;
  status?: string;
  expirationDate?: string;
  criticalItem?: boolean;
  lastUpdated?: string;
  updatedBy?: string;
  notes?: string;
}

interface InventoryResponse {
  lastUpdated: string;
  totalItems: number;
  categories: string[];
  locations: string[];
  vendors: string[];
  supplies: InventoryItem[];
}

class APIService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Inventory endpoints
  async getInventory(): Promise<InventoryResponse> {
    return this.request<InventoryResponse>('/inventory');
  }

  async getInventoryByCategory(category: string): Promise<InventoryItem[]> {
    const data = await this.getInventory();
    return data.supplies.filter(
      item => item.category?.toUpperCase() === category.toUpperCase()
    );
  }

  async sendInventoryOrder(items: string[]): Promise<{ success: boolean; message: string }> {
    return this.request('/inventory/orders/send', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiService = new APIService();
export type { InventoryItem, InventoryResponse };
