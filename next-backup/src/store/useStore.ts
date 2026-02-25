import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SalesData, InventoryItem, generateHistoricalSales, initialInventory, getStatus } from '@/lib/mockData';

interface AppState {
    salesData: SalesData[];
    inventory: InventoryItem[];
    isAuthenticated: boolean;

    // Auth Actions
    login: () => void;
    logout: () => void;

    // Sales Actions
    addSalesRecord: (record: SalesData) => void;
    uploadCSVData: (data: SalesData[]) => void;
    injectRandomSales: () => void;

    // Inventory Actions
    addProduct: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
    deleteProduct: (id: string) => void;
    updateStock: (id: string, delta: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            salesData: generateHistoricalSales(),
            inventory: initialInventory,
            isAuthenticated: false,

            login: () => set({ isAuthenticated: true }),
            logout: () => {
                localStorage.removeItem('sales-flow-storage'); // Reset for clean start if desired, or just set flag
                set({ isAuthenticated: false });
            },

            addSalesRecord: (record) => set((state) => ({
                salesData: [...state.salesData, record]
            })),

            uploadCSVData: (newData) => set((state) => ({
                salesData: [...state.salesData, ...newData]
            })),

            injectRandomSales: () => set((state) => {
                const products = ['Arabica', 'Robusta', 'Espresso', 'Latte', 'Mocha'];
                const newRecords: SalesData[] = Array.from({ length: 5 }).map(() => ({
                    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    revenue: Math.floor(Math.random() * 500) + 100,
                    quantity: Math.floor(Math.random() * 20) + 1
                }));
                return { salesData: [...state.salesData, ...newRecords] };
            }),

            addProduct: (newItem) => set((state) => {
                const id = Math.random().toString(36).substr(2, 9);
                const itemWithId: InventoryItem = {
                    ...newItem,
                    id,
                    status: getStatus(newItem.stock)
                };
                return { inventory: [itemWithId, ...state.inventory] };
            }),

            deleteProduct: (id) => set((state) => ({
                inventory: state.inventory.filter((item) => item.id !== id)
            })),

            updateStock: (id, delta) => set((state) => ({
                inventory: state.inventory.map((item) => {
                    if (item.id === id) {
                        const newStock = Math.max(0, item.stock + delta);
                        return { ...item, stock: newStock, status: getStatus(newStock) };
                    }
                    return item;
                })
            })),
        }),
        {
            name: 'sales-flow-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
