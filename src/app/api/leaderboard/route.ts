import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        const topUsers = await prisma.user.findMany({
            take: limit,
            orderBy: { totalScore: 'desc' },
            select: {
                id: true,
                username: true,
                totalScore: true,
                createdAt: true,
                _count: {
                    select: {
                        attempts: {
                            where: {
                                isCorrect: true
                            }
                        }
                    }
                }
            }
        })

        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            totalScore: user.totalScore,
            correctAnswers: user._count.attempts,
            joinedAt: user.createdAt
        }))

        return NextResponse.json({ 
            leaderboard,
            total: topUsers.length
        });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard' },
            { status: 500 }
        );
    }
}