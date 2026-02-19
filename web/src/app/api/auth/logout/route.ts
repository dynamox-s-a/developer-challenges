import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout realizado com sucesso.',
      },
      { status: 200 }
    );

    // Clear the user cookie by setting it with an expired date
    response.cookies.set({
      name: 'user',
      value: '',
      maxAge: -1,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao fazer logout.',
      },
      { status: 500 }
    );
  }
}