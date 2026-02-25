import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [salesData, setSalesData] = useState(() => {
        const saved = localStorage.getItem('sales_history');
        if (saved) return JSON.parse(saved);
        return [
            { date: 'Mar 2025', revenue: 4200, quantity: 120 },
            { date: 'Apr 2025', revenue: 3800, quantity: 110 },
            { date: 'May 2025', revenue: 5100, quantity: 150 },
            { date: 'Jun 2025', revenue: 4800, quantity: 140 },
            { date: 'Jul 2025', revenue: 6200, quantity: 180 },
            { date: 'Aug 2025', revenue: 5900, quantity: 170 },
            { date: 'Sep 2025', revenue: 7100, quantity: 210 },
            { date: 'Oct 2025', revenue: 6800, quantity: 200 },
            { date: 'Nov 2025', revenue: 8200, quantity: 240 },
            { date: 'Dec 2025', revenue: 9500, quantity: 280 },
            { date: 'Jan 2026', revenue: 7800, quantity: 230 },
            { date: 'Feb 2026', revenue: 8400, quantity: 250 },
        ];
    });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('inventory_list');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: 'Espresso Roast', sku: 'COF-001', stock: 45, category: 'Coffee' },
            { id: 2, name: 'Colombian Blend', sku: 'COF-002', stock: 12, category: 'Coffee' },
            { id: 3, name: 'French Press', sku: 'EQP-001', stock: 8, category: 'Equipment' },
            { id: 4, name: 'Paper Filters', sku: 'ACC-001', stock: 85, category: 'Accessories' },
            { id: 5, name: 'Ceramic Mug', sku: 'ACC-002', stock: 5, category: 'Accessories' },
        ];
    });

    // Auth State
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('app_users');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const [activeOTP, setActiveOTP] = useState(null);

    useEffect(() => {
        localStorage.setItem('sales_history', JSON.stringify(salesData));
    }, [salesData]);

    useEffect(() => {
        localStorage.setItem('inventory_list', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('app_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    const registerUser = (profile) => {
        setUsers(prev => [...prev, profile]);
    };

    const sendOTP = (email) => {
        const userExists = users.find(u => u.workEmail === email);
        if (!userExists) return false;

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setActiveOTP({ email, code: otp });
        console.log(`[AUTH] OTP for ${email}: ${otp}`); // SIMULATED OTP DELIVERY
        return true;
    };

    const verifyOTP = (email, code) => {
        if (activeOTP && activeOTP.email === email && activeOTP.code === code) {
            const user = users.find(u => u.workEmail === email);
            setCurrentUser(user);
            setIsAuthenticated(true);
            setActiveOTP(null);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('isAuthenticated');
    };

    // Sales & Inventory Actions
    const addSalesRecord = (record) => setSalesData(prev => [...prev, record]);
    const updateStock = (id, delta) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
        ));
    };
    const addInventoryItem = (item) => setInventory(prev => [...prev, { ...item, id: Date.now() }]);
    const deleteInventoryItem = (id) => setInventory(prev => prev.filter(item => item.id !== id));
    const injectMockSales = () => {
        const newRecords = Array.from({ length: 5 }).map((_, i) => ({
            date: `New Data ${i + 1}`,
            revenue: Math.floor(Math.random() * 5000),
            quantity: Math.floor(Math.random() * 100)
        }));
        setSalesData(prev => [...prev, ...newRecords]);
    };

    return (
        <DataContext.Provider value={{
            salesData,
            inventory,
            isAuthenticated,
            users,
            currentUser,
            registerUser,
            sendOTP,
            verifyOTP,
            logout,
            addSalesRecord,
            updateStock,
            addInventoryItem,
            deleteInventoryItem,
            injectMockSales
        }}>
            {children}
        </DataContext.Provider>
    );
};
