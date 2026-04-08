import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// import dbConnect from '@/lib/mongodb';
// import User from '@/lib/models/User';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required.' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters.' },
                { status: 400 }
            );
        }

        // await dbConnect();

        // const existing = await User.findOne({ email: email.toLowerCase() });
        // if (existing) {
        //     return NextResponse.json(
        //         { error: 'An account with this email already exists.' },
        //         { status: 409 }
        //     );
        // }

        // const passwordHash = await bcrypt.hash(password, 12);

        // await User.create({
        //     email: email.toLowerCase(),
        //     passwordHash,
        // });

        return NextResponse.json(
            { message: 'Account created successfully. You can now log in.' },
            { status: 201 }
        );
    } catch (err) {
        console.error('[/api/auth/register] Error:', err);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}
