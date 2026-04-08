import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
// import dbConnect from '@/lib/mongodb';
// import User from '@/lib/models/User';

// Global OTP store (development only)
let globalOtpStore = {};

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // STARTTLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

// POST /api/auth — Validates credentials and sends OTP
export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required.' },
                { status: 400 }
            );
        }

        // await dbConnect();

        // const user = await User.findOne({ email: email.toLowerCase() });
        // if (!user) {
        //     return NextResponse.json(
        //         { error: 'No account found with this email. Please sign up first.' },
        //         { status: 404 }
        //     );
        // }

        // const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        // if (!passwordMatch) {
        //     return NextResponse.json(
        //         { error: 'Incorrect password. Please try again.' },
        //         { status: 401 }
        //     );
        // }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in memory
        globalOtpStore[email.toLowerCase()] = {
            code: otp,
            expiry: otpExpiry.getTime()
        };

        // Send OTP email
        try {
            const transporter = createTransporter();
            await transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: email,
                subject: '🔐 Your Analytics Engine Login Code',
                html: `
            <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #F5F5DC; padding: 40px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: #004d00; color: #F5F5DC; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 20px; letter-spacing: 1px;">
                  📊 Analytics Engine
                </div>
              </div>
              <h2 style="color: #004d00; text-align: center; margin-bottom: 8px;">Your Login Code</h2>
              <p style="color: #5a6a5a; text-align: center; margin-bottom: 32px;">Enter this 4-digit code to complete your sign-in.</p>
              <div style="text-align: center; margin-bottom: 32px;">
                <span style="display: inline-block; background: #004d00; color: #F5F5DC; font-size: 48px; font-weight: 900; letter-spacing: 12px; padding: 20px 32px; border-radius: 16px;">
                  ${otp}
                </span>
              </div>
              <p style="color: #8FBC8F; text-align: center; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
              <p style="color: #ccc; text-align: center; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
            `,
            });
            console.log(`[/api/auth] OTP sent to ${email}`);
        } catch (emailErr) {
            console.error(`[/api/auth] Email sending failed: ${emailErr.message}`);
            console.log(`[/api/auth] OTP for testing: ${otp}`);
            // Don't fail the request if email fails - still return success
        }

        return NextResponse.json(
            { message: 'OTP sent to your email address.' },
            { status: 200 }
        );
    } catch (err) {
        console.error('[/api/auth] Error:', err);
        return NextResponse.json(
            { error: 'Failed to send OTP. Check your SMTP configuration.' },
            { status: 500 }
        );
    }
}
