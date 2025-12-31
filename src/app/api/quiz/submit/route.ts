import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

const submitSchema = z.object({
    questionId: z.number(),
    selectedAnswerId: z.number(),
    timeTaken: z.number().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                {  status: 401 }
            )
        }

        const user = verifyToken(token);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        const body = await request.json();
        const validated = submitSchema.parse(body);

        const question = await prisma.question.findUnique({
            where: { id: validated.questionId },
            include: { options: true }
        })

        if (!question) {
            return NextResponse.json(
                { error: 'Question not found' },
                { status: 404 }
            )
        }

        const selectedOption = question.options.find(
            opt => opt.id === validated.selectedAnswerId
        )

        if (!selectedOption) {
            return NextResponse.json(
                { error: 'Invalid answer option selected' },
                { status: 400 }
            )
        }

        const isCorrect = selectedOption.isCorrect;
        const correctAnswer = question.options.find(opt => opt.isCorrect);

        await prisma.userAttempt.create({
            data: {
                userId: parseInt(user.userId),
                questionId: validated.questionId,
                selectedAnswerId: validated.selectedAnswerId,
                isCorrect,
                timeTaken: validated.timeTaken || null
            }
        })

        if (isCorrect) {
            await prisma.user.update({
                where: { id: parseInt(user.userId) },
                data: {
                    totalScore: {
                        increment: question.points
                    }
                }
            })
        }

        const updatedUser = await prisma.user.findUnique({
            where: { id: parseInt(user.userId) },
            select: {
                id: true, 
                username: true, 
                totalScore: true
            }
        })

        return NextResponse.json({
            isCorrect,
            points: isCorrect ? question.points : 0,
            correctAnswer: {
                id: correctAnswer?.id,
                text: correctAnswer?.optionText
            },
            explanation: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${correctAnswer?.optionText}`,
            user: updatedUser
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }

        console.error('Error submitting answer:', error);
        return NextResponse.json(
            { error: 'Failed to submit answer' },
            { status: 500 }
        )
    }
}