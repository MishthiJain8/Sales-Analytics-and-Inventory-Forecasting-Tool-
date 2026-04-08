import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import ProductData from '@/lib/models/ProductData';

// Mock products
const mockProducts = ['Product A', 'Product B'];

// GET /api/products — returns list of unique product names
export async function GET() {
    try {
        // await dbConnect();
        // const names = await ProductData.distinct('productName');
        // names.sort();
        return NextResponse.json({ products: mockProducts }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/products] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
    }
}

// POST /api/products — bulk upsert product data records from CSV
// Expected body: { records: [{ productName, date, revenue, unitsSold, cost }] }
export async function POST(request) {
    try {
        const { records } = await request.json();

        if (!Array.isArray(records) || records.length === 0) {
            return NextResponse.json(
                { error: 'Request body must contain a non-empty "records" array.' },
                { status: 400 }
            );
        }

        // await dbConnect();

        // Mock response
        return NextResponse.json(
            {
                message: `Successfully processed ${records.length} records.`,
                inserted: records.length,
                updated: 0,
                errors: []
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('[POST /api/products] Error:', err);
        return NextResponse.json({ error: 'Failed to upsert product data.' }, { status: 500 });
    }
}
