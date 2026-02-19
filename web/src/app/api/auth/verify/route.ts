import { type NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('user')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Não autenticado.',
        },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: 'Erro de configuração do servidor.',
        },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      userName: string;
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: decoded.userId,
          userName: decoded.userName,
        },
        message: 'Usuário autenticado.',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Token inválido ou expirado.',
      },
      { status: 401 }
    );
  }
}