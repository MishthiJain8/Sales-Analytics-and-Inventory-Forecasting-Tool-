'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used inside a DataProvider');
    return ctx;
}

export function DataProvider({ children }) {
    // List of distinct product names from DB
    const [products, setProducts] = useState([]);
    // Cache: { [productName]: [records] }
    const [productDataMap, setProductDataMap] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    const { token } = useAuth();

    // Fetch all unique product names from DB
    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products || []);
            }
        } catch (err) {
            console.error('Failed to fetch product list:', err);
        }
    }, []);

    // Fetch historical data for a specific product
    const fetchProductData = useCallback(async (productName) => {
        if (productDataMap[productName]) return productDataMap[productName];
        try {
            const res = await fetch(`/api/products/${encodeURIComponent(productName)}`);
            const data = await res.json();
            if (res.ok) {
                setProductDataMap((prev) => ({ ...prev, [productName]: data.records }));
                return data.records;
            }
        } catch (err) {
            console.error(`Failed to fetch data for ${productName}:`, err);
        }
        return [];
    }, [productDataMap]);

    // Upload parsed CSV records to DB
    const uploadCSV = useCallback(async (records) => {
        setUploading(true);
        setUploadResult(null);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ records }),
            });
            const data = await res.json();
            setUploadResult({ ok: res.ok, ...data });
            if (res.ok) {
                // Refresh product list and clear cache
                setProductDataMap({});
                await fetchProducts();
            }
            return { ok: res.ok, ...data };
        } catch (err) {
            const errResult = { ok: false, error: 'Network error during upload.' };
            setUploadResult(errResult);
            return errResult;
        } finally {
            setUploading(false);
        }
    }, [fetchProducts]);

    return (
        <DataContext.Provider value={{
            products,
            productDataMap,
            uploading,
            uploadResult,
            fetchProducts,
            fetchProductData,
            uploadCSV,
        }}>
            {children}
        </DataContext.Provider>
    );
}
