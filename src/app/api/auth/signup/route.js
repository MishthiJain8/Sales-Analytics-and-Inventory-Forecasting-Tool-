import { NextResponse } from 'next/server';
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

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase();

        if (users[emailLower]) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        // Create new user
        const userId = 'user_' + Date.now();
        users[emailLower] = {
            id: userId,
            email: emailLower,
            password: password // In production, hash this!
        };

        return NextResponse.json({
            message: 'Account created successfully',
            user: { email: emailLower, id: userId }
        });
    } catch (err) {
        console.error('[/api/auth/signup] Error:', err);
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
    }
}
