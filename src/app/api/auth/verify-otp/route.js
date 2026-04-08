import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required.' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json(
                { error: 'No OTP was requested. Please start the login process again.' },
                { status: 400 }
            );
        }

        if (new Date() > user.otpExpiry) {
            await User.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null });
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 410 }
            );
        }

        if (user.otp !== otp.trim()) {
            return NextResponse.json(
                { error: 'Incorrect OTP. Please try again.' },
                { status: 401 }
            );
        }

        // OTP is valid — clear it and mark verified
        await User.findByIdAndUpdate(user._id, {
            otp: null,
            otpExpiry: null,
            isVerified: true,
        });

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json(
            {
                message: 'Login successful.',
                token,
                user: { email: user.email, id: user._id },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('[/api/auth/verify-otp] Error:', err);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}
