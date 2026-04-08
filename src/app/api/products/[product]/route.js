import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import ProductData from '@/lib/models/ProductData';

// Mock data
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
        product: 'Product A',
        date: '2023-01-02',
        sales: 120,
        inventory: 45,
        price: 10.0
    }
];

// GET /api/products/[product] — returns all historical records for a specific product
export async function GET(request, { params }) {
    try {
        const productName = decodeURIComponent(params.product);

        if (!productName) {
            return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
        }

        // await dbConnect();

        // const records = await ProductData.find({ productName })
        //     .sort({ date: 1 })
        //     .select('-__v -createdAt -updatedAt')
        //     .lean();

        // if (records.length === 0) {
        //     return NextResponse.json(
        //         { error: `No data found for product: "${productName}"` },
        //         { status: 404 }
        //     );
        // }

        return NextResponse.json({ productName, records: mockRecords }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/products/[product]] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch product data.' }, { status: 500 });
    }
}
