import { subMonths, format, startOfMonth } from 'date-fns';

export interface SalesData {
  date: string;
  revenue: number;
  quantity: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const generateHistoricalSales = (): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = startOfMonth(subMonths(now, i));
    // Generate some seasonal-ish data with randomness
    const baseRevenue = 5000 + Math.sin(i / 2) * 2000;
    const revenue = Math.floor(baseRevenue + Math.random() * 1000);
    const quantity = Math.floor(revenue / (20 + Math.random() * 10));

    data.push({
      date: format(date, 'MMM yyyy'),
      revenue,
      quantity,
    });
  }
  return data;
};

export const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Premium Coffee Beans', sku: 'COF-001', category: 'Beverages', stock: 45, price: 25.99, status: 'In Stock' },
  { id: '2', name: 'Eco-Friendly Filters', sku: 'FIL-002', category: 'Accessories', stock: 12, price: 8.50, status: 'Low Stock' },
  { id: '3', name: 'Ceramic Mug Set', sku: 'MUG-003', category: 'Houseware', stock: 85, price: 34.00, status: 'In Stock' },
  { id: '4', name: 'Electric Grinder', sku: 'GRN-004', category: 'Equipment', stock: 5, price: 120.00, status: 'Low Stock' },
  { id: '5', name: 'French Press', sku: 'PRE-005', category: 'Equipment', stock: 0, price: 45.00, status: 'Out of Stock' },
  { id: '6', name: 'Milk Frother', sku: 'FRO-006', category: 'Equipment', stock: 22, price: 15.99, status: 'In Stock' },
  { id: '7', name: 'Dark Roast Blend', sku: 'COF-007', category: 'Beverages', stock: 60, price: 22.50, status: 'In Stock' },
  { id: '8', name: 'Green Tea Matcha', sku: 'TEA-008', category: 'Beverages', stock: 18, price: 28.00, status: 'Low Stock' },
  { id: '9', name: 'Glass Storage Jar', sku: 'JAR-009', category: 'Accessories', stock: 40, price: 12.99, status: 'In Stock' },
  { id: '10', name: 'Digital Scale', sku: 'SCL-010', category: 'Equipment', stock: 15, price: 35.00, status: 'Low Stock' },
  { id: '11', name: 'Vanilla Syrup', sku: 'SYR-011', category: 'Beverages', stock: 50, price: 9.99, status: 'In Stock' },
  { id: '12', name: 'Caramel Drizzle', sku: 'SYR-012', category: 'Beverages', stock: 8, price: 9.99, status: 'Low Stock' },
];

export const getStatus = (stock: number): InventoryItem['status'] => {
  if (stock === 0) return 'Out of Stock';
  if (stock < 20) return 'Low Stock';
  return 'In Stock';
};
