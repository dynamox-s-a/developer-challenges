import { NextResponse } from "next/server";

const users = [
  {
    id: 1,
    email: "admin@events.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    email: "reader@events.com",
    password: "reader123",
    role: "reader",
  },
];

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = users.find((user) => user.email === email);

  if (!user) {
    return NextResponse.json(
      { error: "Email não encontrado" },
      { status: 401 }
    );
  }

  if (user.password !== password) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
