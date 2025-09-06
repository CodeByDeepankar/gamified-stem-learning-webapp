'use client';

import { useState, useEffect, useCallback } from 'react';
import { OfflineManager } from '@/lib/db/database';

export interface OfflineStatus {
  isOnline: boolean;
  isLoading: boolean;
  lastSyncAt: Date | null;
  pendingSyncCount: number;
  storageUsed: number;
  storageAvailable: number;
}

export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: true,
    isLoading: false,
    lastSyncAt: null,
    pendingSyncCount: 0,
    storageUsed: 0,
    storageAvailable: 0
  });

  const updateNetworkStatus = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      isOnline: OfflineManager.isOnline()
    }));
  }, []);

  const updateStorageInfo = useCallback(async () => {
    const storage = await OfflineManager.getStorageUsage();
    setStatus(prev => ({
      ...prev,
      storageUsed: storage.used,
      storageAvailable: storage.available
    }));
  }, []);

  const updatePendingSyncCount = useCallback(async () => {
    const pendingItems = await OfflineManager.getPendingSyncItems();
    setStatus(prev => ({
      ...prev,
      pendingSyncCount: pendingItems.length
    }));
  }, []);

  const syncData = useCallback(async (): Promise<boolean> => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    
    try {
      const success = await OfflineManager.syncWhenOnline();
      
      if (success) {
        setStatus(prev => ({
          ...prev,
          lastSyncAt: new Date(),
          pendingSyncCount: 0
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const cacheContent = useCallback(async (
    contentId: string, 
    contentType: 'topic' | 'media' | 'assessment', 
    data: unknown
  ): Promise<boolean> => {
    const success = await OfflineManager.cacheContent(contentId, contentType, data);
    if (success) {
      await updateStorageInfo();
    }
    return success;
  }, [updateStorageInfo]);

  const getCachedContent = useCallback(async (
    contentId: string, 
    contentType: 'topic' | 'media' | 'assessment'
  ) => {
    return await OfflineManager.getCachedContent(contentId, contentType);
  }, []);

  const cleanupStorage = useCallback(async (maxAge?: number): Promise<number> => {
    const cleaned = await OfflineManager.cleanupOldContent(maxAge);
    if (cleaned > 0) {
      await updateStorageInfo();
    }
    return cleaned;
  }, [updateStorageInfo]);

  useEffect(() => {
    // Initial setup
    updateNetworkStatus();
    updateStorageInfo();
    updatePendingSyncCount();

    // Network status listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Auto-sync when coming online
    const handleOnline = async () => {
      updateNetworkStatus();
      if (OfflineManager.isOnline()) {
        setTimeout(async () => {
          await syncData();
        }, 1000); // Wait a bit for connection to stabilize
      }
    };

    window.addEventListener('online', handleOnline);

    // Periodic sync check (every 30 seconds when online)
    const syncInterval = setInterval(async () => {
      if (OfflineManager.isOnline()) {
        await updatePendingSyncCount();
        if (status.pendingSyncCount > 0) {
          await syncData();
        }
      }
    }, 30000);

    // Storage info update (every 5 minutes)
    const storageInterval = setInterval(updateStorageInfo, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      window.removeEventListener('online', handleOnline);
      clearInterval(syncInterval);
      clearInterval(storageInterval);
    };
  }, [updateNetworkStatus, updateStorageInfo, updatePendingSyncCount, syncData, status.pendingSyncCount]);

  return {
    status,
    syncData,
    cacheContent,
    getCachedContent,
    cleanupStorage,
    refreshStatus: useCallback(async () => {
      await Promise.all([
        updateNetworkStatus(),
        updateStorageInfo(),
        updatePendingSyncCount()
      ]);
    }, [updateNetworkStatus, updateStorageInfo, updatePendingSyncCount])
  };
}
