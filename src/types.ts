/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabId =
  | 'home'
  | 'image-tools'
  | 'audio-tools'
  | 'video-tools'
  | 'pdf-tools'
  | 'document-tools'
  | 'queue'
  | 'history'
  | 'favorites'
  | 'settings';

export type ToolCategory = 'image' | 'audio' | 'video' | 'pdf' | 'document';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // Name of Lucide icon
  favoritesOrder?: number;
}

export type FileStatus = 'idle' | 'waiting' | 'processing' | 'completed' | 'failed';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: FileStatus;
  error?: string;
  outputUrl?: string;
  outputName?: string;
  thumbnailUrl?: string; // Cache for image/pdf thumbnails
}

export type QueueStatus = 'waiting' | 'processing' | 'completed' | 'failed' | 'paused';

export interface QueueItem {
  id: string;
  toolId: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: QueueStatus;
  step: string;
  timestamp: number;
  error?: string;
  outputUrl?: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  operation: string;
  timestamp: number;
  status: 'completed' | 'failed';
  outputFormat: string;
  outputSize?: number;
  outputUrl?: string;
  error?: string;
}

export interface AppSettings {
  appearance: 'light' | 'dark' | 'system';
  autoDownload: boolean;
  confirmDelete: boolean;
  rememberRecent: boolean;
}
