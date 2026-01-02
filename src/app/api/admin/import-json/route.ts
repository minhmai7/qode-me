import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const questionSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    codeSnippet: z.string().optional().nullable(),
    options: z.array(z.object({
        text: z.string(),
        isCorrect: z.boolean(),
    })).min(2).max(6)
})

const importSchema = z.object({
    questions: z.array(questionSchema),
    category: z.string()
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validated = importSchema.parse(body);

        const category = await prisma.category.findUnique({
            where: { slug: validated.category }
        })

        if (!category) {
            return NextResponse.json(
                { error: `Category '${validated.category}' not found` },
                { status: 404 }
            )
        }
        for (const q of validated.questions) {
            const correctCount = q.options.filter(o => o.isCorrect).length;
            if (correctCount !== 1) {
                return NextResponse.json(
                    { error: `Each question must have exactly one correct option. Question '${q.title}' has ${correctCount}.` },
                    { status: 400 }
                )
            }
        }

        let imported = 0
        let failed = 0
        const errors: string[] = []

        for (const q of validated.questions) {
            try {
                await prisma.question.create({
                    data: {
                        categoryId: category.id,
                        title: q.title,
                        description: q.description || '',
                        questionType: 'MULTIPLE_CHOICE',
                        difficulty: q.difficulty,
                        codeSnippet: q.codeSnippet || null,
                        language: validated.category,
                        points: q.difficulty === 'EASY' ? 10 : q.difficulty === 'MEDIUM' ? 15 : 20,
                        options: {
                            create: q.options.map((opt, index) => ({
                                optionText: opt.text,
                                isCorrect: opt.isCorrect,
                                optionOrder: index + 1,
                            }))
                        }
                    }
                })
                imported++
            } 
            catch (error: unknown) {
                failed++
                const message = error instanceof Error ? error.message : 'Unknown error';
                errors.push(`Failed to import question '${q.title}': ${message}`);
            }
        }

        return NextResponse.json({
            success: true, 
            total: validated.questions.length,
            imported,
            failed,
            errors: errors.length > 0 ? errors : undefined
        })
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }
        console.error('Import error:', error);  
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}