import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, verifyPassword } from "@/lib/auth";
import { email, z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validatedData = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: validatedData.email,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const isValidPassword = await verifyPassword(
            validatedData.password,
            user.passwordHash
        )

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }
        
        const token = generateToken({
            userId: user.id.toString(),
            email: user.email,
            username: user.username,
        })

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                totalScore: user.totalScore,
                
            },
            token,
        })
    }

    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Error during login:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}