/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoryItem } from '../types';
import { Icon } from './Icons';

interface HistoryPageProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onOpenTool?: (toolId: string) => void;
}

export function HistoryPage({ history, onClearHistory, onOpenTool }: HistoryPageProps) {
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Conversion History</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Browse and download your past processing achievements. Kept securely offline.
          </p>
        </div>

        <button
          onClick={onClearHistory}
          disabled={history.length === 0}
          className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-40 transition-colors cursor-pointer"
        >
          Clear History
        </button>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center bg-white dark:bg-neutral-900/40 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Icon name="History" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No conversion history yet</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Any files you convert will appear here for fast downloading.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                  <th className="p-4 pl-6">Source File</th>
                  <th className="p-4">Operation</th>
                  <th className="p-4">Processed At</th>
                  <th className="p-4">Output</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {history.map((item) => {
                  const isCompleted = item.status === 'completed';
                  return (
                    <tr key={item.id} className="text-sm hover:bg-neutral-50/55 dark:hover:bg-neutral-800/10">
                      {/* Name */}
                      <td className="p-4 pl-6 font-bold text-neutral-800 dark:text-neutral-200">
                        <div className="flex items-center gap-2.5">
                          <Icon name="FileText" size={16} className="text-indigo-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{item.fileName}</span>
                        </div>
                      </td>

                      {/* Operation */}
                      <td className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">
                        {item.operation}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-xs font-semibold text-neutral-400">
                        {formatDate(item.timestamp)}
                      </td>

                      {/* Output details */}
                      <td className="p-4 font-semibold">
                        {isCompleted ? (
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px]">
                              {item.outputFormat}
                            </span>
                            <span className="text-xs text-neutral-400 font-medium">
                              {formatBytes(item.outputSize)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <Icon name="AlertCircle" size={12} />
                            Failed
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 pr-6 text-right">
                        {isCompleted && item.outputUrl && (
                          <a
                            href={item.outputUrl}
                            download={item.fileName.split('.')[0] + '_output'}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                          >
                            <Icon name="Download" size={13} />
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
