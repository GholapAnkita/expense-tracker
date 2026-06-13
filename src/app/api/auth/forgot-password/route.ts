import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiry,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // LOG THE LINK FOR TESTING
    console.log('--- PASSWORD RESET LINK ---');
    console.log(resetUrl);
    console.log('---------------------------');

    // Here you would normally send an email using Resend or Nodemailer
    
    return NextResponse.json({ 
      message: 'Reset link generated successfully.',
      resetUrl 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
