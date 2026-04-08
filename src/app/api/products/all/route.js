import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import ProductData from '@/lib/models/ProductData';

// Mock data for testing
const mockRecords = [
    {
        _id: '1',
        product: 'Product A',
        date: '2023-01-01',
        sales: 100,
        inventory: 50,
        price: 10.0
    },
    {
        _id: '2',
        product: 'Product B',
        date: '2023-01-01',
        sales: 200,
        inventory: 30,
        price: 15.0
    }
];

// GET /api/products/all — returns all records for all products
export async function GET() {
    try {
        // await dbConnect();

        // const records = await ProductData.find({})
        //     .sort({ date: 1 })
        //     .select('-__v -createdAt -updatedAt')
        //     .lean();

        return NextResponse.json({ records: mockRecords }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/products/all] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch all product data.' }, { status: 500 });
    }
}
