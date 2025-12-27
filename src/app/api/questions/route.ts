import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Difficulty, QuestionType } from '@prisma/client';
import { ca } from 'zod/locales';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const categorySlug = searchParams.get('category');
        const difficulty = searchParams.get('difficulty') as Difficulty | null;
        const limit = parseInt(searchParams.get('limit') || '10');

        const where: any = {
            questionType: QuestionType.MULTIPLE_CHOICE
        }

        if (categorySlug) {
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug }
            })

            if (!category) {
                return NextResponse.json(
                    { error: `Category '${categorySlug}' not found` },
                    { status: 404 }
                )
            }
            where.categoryId = category.id;
        }

        if (difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
            where.difficulty = difficulty;
        }

        const totalCount = await prisma.question.count({ where });

        if (totalCount === 0) {
            return NextResponse.json(
                { error: 'No questions found for the specified criteria. Please add.' },
                { status: 404 }
            )
        }

        const allQuestionIds = await prisma.question.findMany({
            where,
            select: { id: true }
        });

        const shuffled = allQuestionIds.sort(() => Math.random() - 0.5);
        const selectedIds = shuffled.slice(0, Math.min(limit, shuffled.length));

        const questions = await prisma.question.findMany({
            where: {
                id: { in: selectedIds.map(q => q.id) }
            },
            include: {
                options: {
                    select: {
                        id: true,
                        optionText: true,
                        optionOrder: true,
                },
                orderBy: { optionOrder: 'asc' }
            },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                    }
                }
            }
        })

        const randomizedQuestions = questions.sort(() => Math.random() - 0.5);

        return NextResponse.json({
            questions: randomizedQuestions,
            meta: {
                total: totalCount,
                returned: randomizedQuestions.length,
                limit,
                filters: {
                    category: categorySlug,
                    difficulty,
                    type: 'MULTIPLE_CHOICE'
                }
            }
        })
    }

    catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}