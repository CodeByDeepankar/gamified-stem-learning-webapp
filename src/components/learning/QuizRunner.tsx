"use client";

import React, { useEffect, useState } from 'react';
import { useOffline } from '@/hooks/useOffline';
import { OfflineManager } from '@/lib/db/database';
import { useSession } from '@/hooks/useSession';

type Question = {
  id: string;
  type: 'mcq' | 'tf' | 'short';
  text: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  placeholder?: string;
  points: number;
};

type Quiz = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
};

export default function QuizRunner({ grade = '6' }: { grade?: string }) {
  const { cacheContent, getCachedContent, status } = useOffline();
  const { user } = useSession();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Try load from cache first
        const cached = await getCachedContent(`quiz:${grade}`, 'assessment');
        if (cached && mounted) {
          setQuiz(cached as Quiz);
          setLoading(false);
          // still try refresh from network if online
        }

        if (status.isOnline) {
          const res = await fetch(`/api/quiz?grade=${grade}`);
          if (res.ok) {
            const json = await res.json();
            const q: Quiz = json.quiz;
            if (mounted) setQuiz(q);
            // cache for offline
            await cacheContent(`quiz:${grade}`, 'assessment', q);
          }
        }
      } catch {
        console.error('Failed to load quiz');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [grade, cacheContent, getCachedContent, status.isOnline]);

  function setAnswer(qid: string, val: string | number) {
    setAnswers(a => ({ ...a, [qid]: val }));
  }

  async function onSubmit() {
    if (!quiz) return;
    let total = 0;
    for (const q of quiz.questions) {
      const ans = answers[q.id];
      if (q.type === 'mcq' || q.type === 'tf') {
        if (typeof ans === 'number' && q.correctIndex === ans) total += q.points;
      } else if (q.type === 'short') {
        if (typeof ans === 'string' && q.correctAnswer && ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) total += q.points;
      }
    }
    setScore(total);
    setSubmitted(true);

    // Save progress locally and award XP
    try {
      const uid = user?.userId ?? 'anonymous';
      await OfflineManager.saveProgress(uid, { userId: uid, totalXP: total });
      await OfflineManager.addToSyncQueue?.('update', 'userProgress', uid, { deltaXP: total });
      // awardXP will also queue, but keep local save to progress store
    } catch {
      // ignore
    }
  }

  if (loading) return <div className="p-6">Loading quiz…</div>;
  if (!quiz) return <div className="p-6">No quiz available.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{quiz.title}</h2>
      <div className="bg-white rounded-lg border p-4">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="mb-4">
            <div className="font-medium">{idx + 1}. {q.text}</div>
            <div className="mt-2">
              {q.type === 'mcq' && (
                <div className="space-y-2">
                  {q.options?.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === i}
                        onChange={() => setAnswer(q.id, i)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'tf' && (
                <div className="flex gap-4">
                  {q.options?.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAnswer(q.id, i)}
                      className={`px-3 py-1 rounded ${answers[q.id] === i ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'short' && (
                <input
                  type="text"
                  placeholder={q.placeholder}
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className="w-full rounded border px-3 py-2 mt-2"
                />
              )}
            </div>
          </div>
        ))}

        {!submitted ? (
          <div className="pt-3">
            <button onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-green-50 rounded">
            <div className="font-semibold">You scored: {score} points</div>
            <div className="text-sm text-gray-700 mt-1">Your results are saved locally and will sync when you are back online.</div>
          </div>
        )}
      </div>
    </div>
  );
}
