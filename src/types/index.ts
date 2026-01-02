export interface User {
    id: number
    username: string
    email: string
    totalScore: number
}

export interface Category {
    id: number
    name: string
    slug: string
    icon: string
    description?: string
}

export interface Question {
    id: number
    title: string
    description: string
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
    codeSnippet?: string
    language?: string
    category: Category
    options: AnswerOption[]
}

export interface AnswerOption {
    id: number
    optionText: string
    optionOrder: number
}

export interface QuizSubmission {
    questionId: number
    selectedAnswerId: number
    timeTaken?: number
}

export interface QuizResult {
    isCorrect: boolean
    points: number
    correctAnswer: {
        id: number
        text: string
    }
    explanation: string
    user: User
}

export interface LeaderboardEntry {
    rank: number 
    username: string
    totalScore: number
    correctAnswers: number
    joinedAt: Date
}