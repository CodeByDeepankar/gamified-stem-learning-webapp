import { NextResponse } from 'next/server';

// Simple mocked quizzes. In a real app these would come from the database
const SAMPLE_QUIZZES = {
	grade6: {
		id: 'quiz-grade6-maths-1',
		title: 'Grade 6 — Basics of Fractions',
		subject: 'mathematics',
		grade: '6',
		questions: [
			{
				id: 'q1',
				type: 'mcq',
				text: 'What is 1/2 + 1/4?',
				options: ['1/4', '3/4', '1', '2/3'],
				correctIndex: 1,
				points: 10,
			},
			{
				id: 'q2',
				type: 'tf',
				text: 'A fraction with denominator 1 is always an integer.',
				options: ['True', 'False'],
				correctIndex: 0,
				points: 5,
			},
			{
				id: 'q3',
				type: 'short',
				text: 'Convert 3/6 to a simplified fraction.',
				placeholder: 'e.g. 1/2',
				correctAnswer: '1/2',
				points: 10,
			},
		],
	},
	grade7: {
		id: 'quiz-grade7-science-1',
		title: 'Grade 7 — Living & Non-living',
		subject: 'science',
		grade: '7',
		questions: [
			{
				id: 'q1',
				type: 'mcq',
				text: 'Which of these is a living thing?',
				options: ['Rock', 'Tree', 'Water', 'Air'],
				correctIndex: 1,
				points: 10,
			},
		],
	},
};

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const grade = (url.searchParams.get('grade') || '6').toLowerCase();
		const key = `grade${grade}`;

		const quiz = SAMPLE_QUIZZES[key as keyof typeof SAMPLE_QUIZZES] ?? SAMPLE_QUIZZES.grade6;

		return NextResponse.json({ ok: true, quiz }, { status: 200 });
			} catch {
				return NextResponse.json({ ok: false, error: 'Failed to load quiz' }, { status: 500 });
			}
}
