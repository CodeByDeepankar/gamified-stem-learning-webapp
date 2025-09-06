/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie, { Table } from 'dexie';
import { 
  UserProgress, 
  Badge, 
  Achievement, 
  LearningSession, 
  DailyChallenge 
} from '@/lib/types/gamification';
import { 
  Topic, 
  LearningPath, 
  MediaResource,
  UserProgress as ContentProgress,
  Subject
} from '@/lib/types/content';

export interface User {
  id?: number;
  userId: string;
  role?: 'student' | 'teacher';
  name: string;
  grade: string;
  preferredLanguage: 'en' | 'or';
  // School/Org identifiers
  schoolId?: string;
  schoolNameOrId?: string;
  // Student-specific
  studentId?: string;
  // Teacher-specific
  subject?: string;
  avatar?: string;
  createdAt: Date;
  lastSyncAt?: Date;
}

export interface OfflineContent {
  id?: number;
  contentId: string;
  contentType: 'topic' | 'media' | 'assessment';
  data: any;
  downloadedAt: Date;
  lastAccessedAt: Date;
  size: number;
  isStale: boolean;
}

export interface SyncQueue {
  id?: number;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: any;
  timestamp: Date;
  retries: number;
  synced: boolean;
}

export class LearningPlatformDB extends Dexie {
  // User data
  users!: Table<User>;
  userProgress!: Table<UserProgress>;
  contentProgress!: Table<ContentProgress>;
  
  // Gamification
  badges!: Table<Badge>;
  achievements!: Table<Achievement>;
  learningSessions!: Table<LearningSession>;
  dailyChallenges!: Table<DailyChallenge>;
  
  // Content
  topics!: Table<Topic>;
  learningPaths!: Table<LearningPath>;
  mediaResources!: Table<MediaResource>;
  
  // Offline functionality
  offlineContent!: Table<OfflineContent>;
  syncQueue!: Table<SyncQueue>;

  constructor() {
    super('LearningPlatformDB');
    
    this.version(1).stores({
      users: '++id, userId, grade, preferredLanguage',
      userProgress: '++id, userId, totalXP, level, currentStreak',
      contentProgress: '++id, userId',
      
      badges: '++id, category, rarity',
      achievements: '++id, category, userId',
      learningSessions: '++id, userId, subject, grade, startTime',
      dailyChallenges: '++id, date, subject, grade',
      
      topics: '++id, subject, grade, difficulty, isOfflineReady',
      learningPaths: '++id, subject, grade, isRecommended',
      mediaResources: '++id, type, size, isDownloaded',
      
      offlineContent: '++id, contentId, contentType, downloadedAt, lastAccessedAt',
      syncQueue: '++id, entityType, timestamp, synced'
    });

    // Add hooks for automatic timestamping
    this.offlineContent.hook('creating', (primKey, obj, trans) => {
      obj.lastAccessedAt = new Date();
    });

    this.syncQueue.hook('creating', (primKey, obj, trans) => {
      obj.timestamp = new Date();
      obj.retries = 0;
      obj.synced = false;
    });
  }
}

export const db = new LearningPlatformDB();

// Database utility functions
export class OfflineManager {
  
  // User & Auth management
  static async registerStudent(params: { schoolIdOrName: string; grade: string; name: string; studentId: string; preferredLanguage?: 'en' | 'or'; }): Promise<User> {
    const preferredLanguage = params.preferredLanguage ?? 'en';
    const existing = await db.users.where('userId').equals(params.studentId).first();
    if (existing) {
      // Update existing basic fields if missing
      const patch: Partial<User> = {
        role: 'student',
        name: params.name,
        grade: params.grade,
        schoolNameOrId: params.schoolIdOrName,
        preferredLanguage,
        studentId: params.studentId,
      };
      await db.users.update(existing.id!, patch);
      const merged = { ...existing, ...patch } as User;
      await this.addToSyncQueue('update', 'users', merged.userId, patch);
      return merged;
    }

    const user: User = {
      userId: params.studentId,
      role: 'student',
      name: params.name,
      grade: params.grade,
      preferredLanguage,
      schoolNameOrId: params.schoolIdOrName,
      studentId: params.studentId,
      createdAt: new Date(),
    };
    const id = await db.users.add(user);
    user.id = id;
    await this.addToSyncQueue('create', 'users', user.userId, user);
    return user;
  }

  static async registerTeacher(params: { schoolId: string; grade: string; subject: string; userId?: string; name?: string; preferredLanguage?: 'en' | 'or'; }): Promise<User> {
    const preferredLanguage = params.preferredLanguage ?? 'en';
    const uid = params.userId ?? `${params.schoolId}:${params.subject}:${params.grade}`;
    const existing = await db.users.where('userId').equals(uid).first();
    if (existing) {
      const patch: Partial<User> = {
        role: 'teacher',
        grade: params.grade,
        schoolId: params.schoolId,
        subject: params.subject,
        preferredLanguage,
      };
      if (params.name) patch.name = params.name;
      await db.users.update(existing.id!, patch);
      const merged = { ...existing, ...patch } as User;
      await this.addToSyncQueue('update', 'users', merged.userId, patch);
      return merged;
    }

    const user: User = {
      userId: uid,
      role: 'teacher',
      name: params.name ?? 'Class Teacher',
      grade: params.grade,
      preferredLanguage,
      schoolId: params.schoolId,
      subject: params.subject,
      createdAt: new Date(),
    };
    const id = await db.users.add(user);
    user.id = id;
    await this.addToSyncQueue('create', 'users', user.userId, user);
    return user;
  }

  static async loginStudent(params: { schoolIdOrName: string; grade: string; studentId: string; }): Promise<User | null> {
    const user = await db.users.where('userId').equals(params.studentId).first();
    if (!user) return null;
    if (user.grade !== params.grade) return null;
    // If we stored schoolNameOrId, we can optionally check substring match
    if (user.schoolNameOrId && params.schoolIdOrName && user.schoolNameOrId !== params.schoolIdOrName) {
      // Allow loose match: skip strict check
    }
    return user;
  }

  static async loginTeacher(params: { schoolId: string; grade: string; subject: string; }): Promise<User | null> {
    const uid = `${params.schoolId}:${params.subject}:${params.grade}`;
    const user = await db.users.where('userId').equals(uid).first();
    return user ?? null;
  }

  // Content caching
  static async cacheContent(contentId: string, contentType: 'topic' | 'media' | 'assessment', data: unknown) {
    try {
      const size = new Blob([JSON.stringify(data)]).size;
      
      await db.offlineContent.put({
        contentId,
        contentType,
        data,
        downloadedAt: new Date(),
        lastAccessedAt: new Date(),
        size,
        isStale: false
      });
      
      return true;
    } catch (error) {
      console.error('Failed to cache content:', error);
      return false;
    }
  }

  static async getCachedContent(contentId: string, contentType: 'topic' | 'media' | 'assessment') {
    try {
      const content = await db.offlineContent
        .where('contentId')
        .equals(contentId)
        .and(item => item.contentType === contentType)
        .first();

      if (content) {
        // Update last accessed time
        await db.offlineContent.update(content.id!, { lastAccessedAt: new Date() });
        return content.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get cached content:', error);
      return null;
    }
  }

  // Progress & XP management
  static async awardXP(userId: string, amount: number): Promise<boolean> {
    try {
      const prog = await db.userProgress.where('userId').equals(userId).first();
      if (!prog) {
        await db.userProgress.add({
          id: crypto.randomUUID(),
          userId,
          totalXP: amount,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          badgesEarned: [],
          achievementsUnlocked: [],
          lastActivityDate: new Date(),
          weeklyGoalProgress: amount,
          weeklyGoalTarget: 100,
        });
      } else {
        const newXP = (prog.totalXP || 0) + amount;
        const newLevel = Math.max(1, Math.floor(newXP / 100) + 1);
        await db.userProgress.where('userId').equals(userId).modify({
          totalXP: newXP,
          level: newLevel,
          lastActivityDate: new Date(),
          weeklyGoalProgress: (prog.weeklyGoalProgress || 0) + amount,
        } as any);
      }
      await this.addToSyncQueue('update', 'userProgress', userId, { deltaXP: amount });
      return true;
    } catch (e) {
      console.error('Failed to award XP', e);
      return false;
    }
  }

  static async startLearningSession(params: { userId: string; subject: string; grade: string; topicId: string; }): Promise<string | null> {
    try {
      const id = crypto.randomUUID();
      await db.learningSessions.add({
        id,
        userId: params.userId,
        subject: params.subject,
        grade: params.grade,
        topicId: params.topicId,
        startTime: new Date(),
        endTime: new Date(),
        xpEarned: 0,
        accuracy: 0,
        completionStatus: 'partial',
        challengesAttempted: 0,
        challengesCorrect: 0,
      } as any);
      await this.addToSyncQueue('create', 'learningSession', id, params);
      return id;
    } catch (e) {
      console.error('Failed to start learning session', e);
      return null;
    }
  }

  static async endLearningSession(sessionId: string, results: Partial<LearningSession>): Promise<boolean> {
    try {
      await db.learningSessions.update(sessionId as any, {
        endTime: new Date(),
        completionStatus: results.completionStatus ?? 'completed',
        xpEarned: results.xpEarned ?? 0,
        accuracy: results.accuracy ?? 0,
        challengesAttempted: results.challengesAttempted ?? 0,
        challengesCorrect: results.challengesCorrect ?? 0,
      } as any);
      await this.addToSyncQueue('update', 'learningSession', sessionId, results);
      if (results.xpEarned && results.xpEarned > 0) {
        await this.awardXP((results as any).userId, results.xpEarned);
      }
      return true;
    } catch (e) {
      console.error('Failed to end learning session', e);
      return false;
    }
  }

  // Teacher utilities
  static async getStudentsBySchool(schoolId: string): Promise<User[]> {
    try {
      const users = await db.users.toArray();
      return users.filter(u => (u.role === 'student') && (u.schoolNameOrId === schoolId || u.schoolId === schoolId));
    } catch (e) {
      console.error('Failed to fetch students by school', e);
      return [];
    }
  }

  static async getSchoolLeaderboard(schoolId: string): Promise<Array<{ user: User; progress: UserProgress | null }>> {
    try {
      const students = await this.getStudentsBySchool(schoolId);
      const ids = students.map(s => s.userId);
      const progresses = ids.length > 0 ? await db.userProgress.where('userId').anyOf(ids).toArray() : [];
      const progressByUser = new Map(progresses.map(p => [p.userId, p]));
      const out = students.map(user => ({ user, progress: progressByUser.get(user.userId) ?? null }));
      out.sort((a, b) => (b.progress?.totalXP ?? 0) - (a.progress?.totalXP ?? 0));
      return out;
    } catch (e) {
      console.error('Failed to compute leaderboard', e);
      return [];
    }
  }

  static async publishDailyChallenge(dc: Omit<DailyChallenge, 'id' | 'unlockedAt'> & { id?: string }): Promise<string | null> {
    try {
      const id = dc.id ?? crypto.randomUUID();
      const item: DailyChallenge = {
        ...(dc as any),
        id,
        // Keep as provided fields; DailyChallenge type has unlockedAt? It defines date field not unlockedAt.
      };
      await db.dailyChallenges.add(item as any);
      await this.addToSyncQueue('create', 'dailyChallenge', id, item);
      return id;
    } catch (e) {
      console.error('Failed to publish daily challenge', e);
      return null;
    }
  }

  static async publishQuiz(payload: { schoolId: string; grade: string; subject: string; title: string; description?: string }): Promise<string> {
    const id = crypto.randomUUID();
    await this.addToSyncQueue('create', 'quiz', id, payload);
    return id;
  }

  // Progress management
  static async saveProgress(userId: string, progressData: Partial<UserProgress>) {
    try {
      // Save locally
      await db.userProgress.put({ ...progressData, userId } as UserProgress);
      
      // Add to sync queue
      await this.addToSyncQueue('update', 'userProgress', userId, progressData);
      
      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }

  static async getProgress(userId: string): Promise<UserProgress | null> {
    try {
      return await db.userProgress.where('userId').equals(userId).first() || null;
    } catch (error) {
      console.error('Failed to get progress:', error);
      return null;
    }
  }

  // Sync queue management
  static async addToSyncQueue(
    action: 'create' | 'update' | 'delete',
    entityType: string,
    entityId: string,
    data: unknown
  ) {
    try {
      await db.syncQueue.add({
        action,
        entityType,
        entityId,
        data,
        timestamp: new Date(),
        retries: 0,
        synced: false
      });
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  static async getPendingSyncItems(): Promise<SyncQueue[]> {
    try {
      return await db.syncQueue.filter(item => item.synced === false).toArray();
    } catch (error) {
      console.error('Failed to get pending sync items:', error);
      return [];
    }
  }

  // Session and analytics helpers
  static async getUserSessions(userId: string) {
    return await db.learningSessions.where('userId').equals(userId).toArray();
  }

  static async getUserSessionsInRange(userId: string, from: Date, to: Date) {
    const all = await db.learningSessions.where('userId').equals(userId).toArray();
    return all.filter(s => new Date(s.startTime) >= from && new Date(s.startTime) <= to);
  }

  static async getStudyTimeMinutes(userId: string, period: 'today' | 'week'): Promise<number> {
    const now = new Date();
    const start = new Date(now);
    if (period === 'today') {
      start.setHours(0,0,0,0);
    } else {
      const day = now.getDay();
      const diff = (day === 0 ? 6 : day - 1); // Monday-start week
      start.setDate(now.getDate() - diff);
      start.setHours(0,0,0,0);
    }
    const list = await this.getUserSessionsInRange(userId, start, now);
    let minutes = 0;
    for (const s of list) {
      const end = new Date(s.endTime);
      const begin = new Date(s.startTime);
      minutes += Math.max(0, Math.round((end.getTime() - begin.getTime()) / 60000));
    }
    return minutes;
  }

  static async getXPBySubject(userId: string): Promise<Record<Subject | string, number>> {
    const sessions = await this.getUserSessions(userId);
    const acc: Record<string, number> = {};
    for (const s of sessions) {
      acc[s.subject] = (acc[s.subject] || 0) + (s.xpEarned || 0);
    }
    return acc;
  }

  static async getEarnedBadges(userId: string): Promise<Badge[]> {
    const prog = await db.userProgress.where('userId').equals(userId).first();
    if (!prog || !prog.badgesEarned || prog.badgesEarned.length === 0) return [];
    const badges = await db.badges.toArray();
    const set = new Set(prog.badgesEarned);
    return badges.filter(b => set.has(b.id));
  }

  static async getClassEngagement(schoolId: string, grade: string): Promise<{ avgMinutesWeek: number; activeToday: number; activeThisWeek: number; totalStudents: number; }> {
    const students = (await this.getStudentsBySchool(schoolId)).filter(s => s.grade === grade);
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0,0,0,0);

    let totalMinutes = 0;
    let activeToday = 0;
    let activeThisWeek = 0;

    for (const st of students) {
      const sessionsWeek = await this.getUserSessionsInRange(st.userId, startOfWeek, now);
      if (sessionsWeek.length > 0) activeThisWeek += 1;
      const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
      const todaySessions = sessionsWeek.filter(s => new Date(s.startTime) >= todayStart);
      if (todaySessions.length > 0) activeToday += 1;
      for (const s of sessionsWeek) {
        const end = new Date(s.endTime); const begin = new Date(s.startTime);
        totalMinutes += Math.max(0, Math.round((end.getTime() - begin.getTime()) / 60000));
      }
    }

    const avgMinutesWeek = students.length > 0 ? Math.round(totalMinutes / students.length) : 0;
    return { avgMinutesWeek, activeToday, activeThisWeek, totalStudents: students.length };
  }

  static async markSynced(syncId: number) {
    try {
      await db.syncQueue.update(syncId, { synced: true });
    } catch (error) {
      console.error('Failed to mark item as synced:', error);
    }
  }

  // Storage management
  static async getStorageUsage(): Promise<{ used: number; available: number }> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0
        };
      }
    } catch (error) {
      console.error('Failed to get storage estimate:', error);
    }
    
    return { used: 0, available: 0 };
  }

  static async cleanupOldContent(maxAge: number = 30 * 24 * 60 * 60 * 1000) {
    try {
      const cutoffDate = new Date(Date.now() - maxAge);
      
      const oldContent = await db.offlineContent
        .where('lastAccessedAt')
        .below(cutoffDate)
        .toArray();

      if (oldContent.length > 0) {
        const ids = oldContent.map(item => item.id!);
        await db.offlineContent.bulkDelete(ids);
        console.log(`Cleaned up ${oldContent.length} old content items`);
      }
      
      return oldContent.length;
    } catch (error) {
      console.error('Failed to cleanup old content:', error);
      return 0;
    }
  }

  // Network status management
  static isOnline(): boolean {
    return navigator.onLine;
  }

  static async syncWhenOnline(): Promise<boolean> {
    if (!this.isOnline()) {
      return false;
    }

    try {
      const pendingItems = await this.getPendingSyncItems();
      
      for (const item of pendingItems) {
        try {
          // Here you would make API calls to sync data
          // For now, we'll just simulate success
          await new Promise(resolve => setTimeout(resolve, 100));
          
          await this.markSynced(item.id!);
        } catch (syncError) {
          // Increment retry count
          await db.syncQueue.update(item.id!, { 
            retries: item.retries + 1 
          });
          console.error(`Failed to sync item ${item.id}:`, syncError);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to sync data:', error);
      return false;
    }
  }
}

// Initialize database when imported
db.open().catch(error => {
  console.error('Failed to open database:', error);
});
