import { NextResponse } from 'next/server';
import { addRecords, getRecords } from '../../dataStore.js';

export async function POST(request) {
    try {
        const { records } = await request.json();

        if (!Array.isArray(records) || records.length === 0) {
            return NextResponse.json(
                { error: 'No records provided' },
                { status: 400 }
            );
        }

        const result = addRecords(records);
        return NextResponse.json(result);
    } catch (err) {
        console.error('[/api/data/upload] Error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const records = getRecords();
        return NextResponse.json({ records });
    } catch (err) {
        console.error('[/api/data/get] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
