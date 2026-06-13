import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({ 
      name, 
      email, 
      password,
      role: email === 'ankitagholap100@gmail.com' ? 'admin' : 'user'
    });
    return NextResponse.json({ message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to register user' }, { status: 500 });
  }
}
