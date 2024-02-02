import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "./schema";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = postSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });
  }

  const validatedBody = validation.data;
  const user = await prisma.user.findUnique({
    where: { email: validatedBody.email },
  });

  if (user) {
    return NextResponse.json({ message: "User with this e-mail already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const createdUser = await prisma.user.create({
    data: {
      email: validatedBody.email,
      name: validatedBody.name,
      hashedPassword,
    },
  });

  return NextResponse.json({
    id: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
  });
}
