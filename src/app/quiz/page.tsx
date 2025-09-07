import QuizRunner from '@/components/learning/QuizRunner';
import { useSession } from '@/hooks/useSession';

export default function QuizPage() {
  const { user } = useSession();
  const grade = user?.grade ?? '6';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
      <p className="text-gray-600 mb-6">Choose a quiz and try it offline — your progress will sync when online.</p>
      <QuizRunner grade={String(grade)} />
    </div>
  );
}

