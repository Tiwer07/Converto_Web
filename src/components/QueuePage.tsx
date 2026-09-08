/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QueueItem } from '../types';
import { Icon } from './Icons';
import { TOOLS } from '../data/tools';

interface QueuePageProps {
  queue: QueueItem[];
  setQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  isQueuePaused: boolean;
  setIsQueuePaused: (paused: boolean) => void;
}

export function QueuePage({
  queue,
  setQueue,
  isQueuePaused,
  setIsQueuePaused,
}: QueuePageProps) {
  const handleClearCompleted = () => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed' && item.status !== 'failed'));
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const getToolName = (toolId: string) => {
    return TOOLS.find((t) => t.id === toolId)?.name || 'Unknown Tool';
  };

  // Find the item currently processing
  const processingItem = queue.find((item) => item.status === 'processing');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Batch Queue</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your enqueued files and schedule conversions sequentially.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsQueuePaused(!isQueuePaused)}
            disabled={queue.length === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
              isQueuePaused
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200'
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200'
            } disabled:opacity-40`}
          >
            <Icon name={isQueuePaused ? 'Play' : 'Pause'} size={14} />
            {isQueuePaused ? 'Resume Queue' : 'Pause Queue'}
          </button>

          <button
            onClick={handleClearCompleted}
            disabled={queue.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 transition-all cursor-pointer disabled:opacity-40"
          >
            Clear Completed
          </button>
        </div>
      </div>

      {/* Queue items list */}
      {queue.length === 0 ? (
        <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center bg-white dark:bg-neutral-900/40 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Icon name="Layers" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Your queue is empty</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Add multiple files inside any converter workspace to process them in a batch.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active processing warning card */}
          {processingItem && (
            <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-center gap-4">
              <Icon name="Loader2" size={20} className="animate-spin text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block uppercase tracking-wide">
                  Currently Processing
                </span>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  {processingItem.fileName} ({getToolName(processingItem.toolId)})
                </p>
              </div>
            </div>
          )}

          <div className="border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden">
            {queue.map((item) => {
              const isProcessing = item.status === 'processing';
              const isCompleted = item.status === 'completed';
              const isFailed = item.status === 'failed';
              const isPaused = item.status === 'paused';

              return (
                <div
                  key={item.id}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isProcessing ? 'bg-indigo-50/10 dark:bg-indigo-950/10' : ''
                  }`}
                >
                  {/* File & Tool Info */}
                  <div className="flex items-start gap-3.5 max-w-md overflow-hidden">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isProcessing
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Icon name="FileText" size={20} />
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm truncate">
                        {item.fileName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase">
                          {getToolName(item.toolId)}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <span className="text-[11px] text-neutral-400 font-semibold">
                          {(item.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 max-w-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500">
                      <span>{item.step || 'Waiting in line'}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFailed
                            ? 'bg-red-500'
                            : isCompleted
                            ? 'bg-emerald-500'
                            : isPaused
                            ? 'bg-neutral-400'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badges & Item Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                        isProcessing
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30'
                          : isCompleted
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30'
                          : isFailed
                          ? 'bg-rose-50 border-rose-100 text-rose-500'
                          : 'bg-neutral-50 border-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:border-neutral-700'
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isCompleted && item.outputUrl && (
                        <a
                          href={item.outputUrl}
                          download={item.fileName.replace(/\.[^/.]+$/, '') + '_converted'}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          title="Download converted file"
                        >
                          <Icon name="Download" size={16} />
                        </a>
                      )}

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-neutral-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove enqueued file"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
