import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import dbConnect from '@/lib/mongodb';
// import User from '@/lib/models/User';

// Global OTP store (development only)
let globalOtpStore = {};

// POST /api/verify — Checks OTP and logs the user in
export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required.' },
                { status: 400 }
            );
        }

        // Check OTP from in-memory store
        const emailKey = email.toLowerCase();
        const storedData = globalOtpStore[emailKey];
        
        if (!storedData) {
            return NextResponse.json(
                { error: 'No OTP was requested. Please start the login process again.' },
                { status: 400 }
            );
        }

        if (storedData.expiry < Date.now()) {
            delete globalOtpStore[emailKey];
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 410 }
            );
        }

        if (storedData.code !== otp.trim()) {
            return NextResponse.json(
                { error: 'Incorrect OTP. Please try again.' },
                { status: 401 }
            );
        }

        // OTP is valid - clear it
        delete globalOtpStore[emailKey];

        const token = jwt.sign(
            { userId: 'testid', email: email },
            process.env.JWT_SECRET || 'dev-secret-key',
            { expiresIn: '7d' }
        );

        return NextResponse.json(
            {
                message: 'Login successful.',
                token,
                user: { email: email, id: 'testid' },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('[/api/verify] Error:', err);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}

// Helper function to set OTP (used by auth route)
function setOtp(email, code, expiry) {
    globalOtpStore[email.toLowerCase()] = { code, expiry };
}
