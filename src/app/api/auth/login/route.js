import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users } from '../userStore.js';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase();
        const user = users[emailLower];

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_SECRET || 'dev-secret-key',
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            token,
            user: { email: user.email, id: user.id }
        });
    } catch (err) {
        console.error('[/api/auth/login] Error:', err);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
