import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validatedData = registerSchema.parse(body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.username },
                ],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 400 }
            )
        }

        const passwordHash = await hashPassword(validatedData.password);

        const user = await prisma.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                passwordHash: passwordHash,
            },
            select: {
                id: true,
                username: true,
                email: true,
                totalScore: true,
                createdAt: true,
            },
        })
        
        const token = generateToken({
            userId: user.id.toString(),
            email: user.email,
            username: user.username,
        })

        return NextResponse.json({
            message: 'User registered successfully',
            user,
            token,
        }, { status: 201 })
    }

    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Error during registration:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}