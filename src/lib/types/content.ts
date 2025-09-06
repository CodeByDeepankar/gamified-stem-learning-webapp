export type Subject = 'science' | 'technology' | 'engineering' | 'mathematics';
export type Grade = '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'lesson' | 'exercise' | 'project' | 'assessment' | 'experiment';

export interface Topic {
  id: string;
  title: string;
  titleOdia: string;
  description: string;
  descriptionOdia: string;
  subject: Subject;
  grade: Grade;
  difficulty: Difficulty;
  estimatedDuration: number; // in minutes
  prerequisites: string[]; // Topic IDs
  learningObjectives: string[];
  learningObjectivesOdia: string[];
  keywords: string[];
  keywordsOdia: string[];
  isOfflineReady: boolean;
  lastUpdated: Date;
  content: ContentSection[];
}

export interface ContentSection {
  id: string;
  type: ContentType;
  title: string;
  titleOdia: string;
  content: string; // HTML or Markdown content
  contentOdia: string;
  media?: MediaResource[];
  interactiveElements?: InteractiveElement[];
  assessment?: Assessment;
  order: number;
}

export interface MediaResource {
  id: string;
  type: 'image' | 'video' | 'audio' | 'animation' | 'simulation';
  url: string;
  localPath?: string; // For offline storage
  alt: string;
  altOdia: string;
  caption?: string;
  captionOdia?: string;
  thumbnail?: string;
  duration?: number; // For video/audio in seconds
  size: number; // File size in bytes
  isDownloaded: boolean;
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'drag_drop' | 'matching' | 'simulation' | 'calculator' | 'drawing';
  config: Record<string, unknown>; // Flexible configuration
  points: number;
  feedback: Feedback;
}

export interface Assessment {
  id: string;
  title: string;
  titleOdia: string;
  type: 'formative' | 'summative';
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  showCorrectAnswers: boolean;
  randomizeQuestions: boolean;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'ordering';
  question: string;
  questionOdia: string;
  options?: string[];
  optionsOdia?: string[];
  correctAnswer: string | string[];
  explanation: string;
  explanationOdia: string;
  points: number;
  difficulty: Difficulty;
  subject: Subject;
  bloom_taxonomy: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface Feedback {
  correct: string;
  correctOdia: string;
  incorrect: string;
  incorrectOdia: string;
  hint?: string;
  hintOdia?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  nameOdia: string;
  description: string;
  descriptionOdia: string;
  subject: Subject;
  grade: Grade;
  estimatedDuration: number; // in hours
  topics: string[]; // Ordered list of topic IDs
  prerequisites: string[]; // Other learning path IDs
  skills: string[];
  skillsOdia: string[];
  badge?: string; // Badge ID awarded on completion
  isRecommended: boolean;
  icon: string;
  color: string;
}

export interface Curriculum {
  grade: Grade;
  subjects: {
    [key in Subject]: {
      name: string;
      nameOdia: string;
      description: string;
      descriptionOdia: string;
      learningPaths: string[];
      topics: string[];
      icon: string;
      color: string;
    };
  };
}

export interface UserProgress {
  userId: string;
  topicProgress: {
    [topicId: string]: {
      status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
      progress: number; // 0-100%
      timeSpent: number; // in minutes
      lastAccessed: Date;
      completedSections: string[];
      assessmentScores: { [assessmentId: string]: number };
      attempts: number;
    };
  };
  pathProgress: {
    [pathId: string]: {
      status: 'not_started' | 'in_progress' | 'completed';
      progress: number; // 0-100%
      startedAt: Date;
      completedAt?: Date;
      completedTopics: string[];
    };
  };
}

export interface StudyMaterial {
  id: string;
  title: string;
  titleOdia: string;
  type: 'reference' | 'formula_sheet' | 'glossary' | 'examples';
  subject: Subject;
  grade?: Grade;
  content: string;
  contentOdia: string;
  downloadable: boolean;
  tags: string[];
  tagsOdia: string[];
}
