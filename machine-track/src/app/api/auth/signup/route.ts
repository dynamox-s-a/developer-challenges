import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
}
