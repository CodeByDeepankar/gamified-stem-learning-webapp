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
  UserProgress as ContentProgress
} from '@/lib/types/content';

export interface User {
  id?: number;
  userId: string;
  name: string;
  grade: string;
  preferredLanguage: 'en' | 'or';
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
  
  // Content caching
  static async cacheContent(contentId: string, contentType: 'topic' | 'media' | 'assessment', data: any) {
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
    data: any
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
      return await db.syncQueue.where('synced').equals(false).toArray();
    } catch (error) {
      console.error('Failed to get pending sync items:', error);
      return [];
    }
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
