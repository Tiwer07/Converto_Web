/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppSettings } from '../types';
import { Icon } from './Icons';

interface SettingsPageProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function SettingsPage({ settings, setSettings }: SettingsPageProps) {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-5">
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Preferences</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Personalize your Converto workspaces, default theme modes, and data safety behaviors.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Icon name="Sliders" className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-extrabold text-neutral-800 dark:text-neutral-100 text-[15px]">Appearance</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: 'Sun' },
              { id: 'dark', label: 'Dark Mode', icon: 'Moon' },
              { id: 'system', label: 'System Default', icon: 'RefreshCw' },
            ].map((theme) => {
              const isActive = settings.appearance === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => updateSetting('appearance', theme.id as any)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/20 text-indigo-600 dark:text-indigo-400'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Icon name={theme.icon} size={18} className="mb-2" />
                  <span className="text-xs font-bold">{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Behavior Panel Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Icon name="Settings" className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-extrabold text-neutral-800 dark:text-neutral-100 text-[15px]">Workspace Behavior</h3>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {/* Auto download */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200 block">
                  Automatically Download Files
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 block font-medium">
                  Trigger instant browser download as soon as processing completes.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoDownload}
                onChange={(e) => updateSetting('autoDownload', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {/* Confirm delete */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200 block">
                  Confirm Before Deleting Files
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 block font-medium">
                  Prompt a confirmation check before clearing enqueued source items.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.confirmDelete}
                onChange={(e) => updateSetting('confirmDelete', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {/* Remember recent */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200 block">
                  Remember Recent Tools
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 block font-medium">
                  Persist recently used modules on your dashboard landing page.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.rememberRecent}
                onChange={(e) => updateSetting('rememberRecent', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="bg-indigo-50/40 dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Icon name="Shield" className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-extrabold text-indigo-900 dark:text-indigo-400 text-[15px]">Privacy & Confidentiality Guarantee</h3>
          </div>

          <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium space-y-3">
            <p>
              Unlike standard converters that upload your documents to external clouds,{' '}
              <strong className="text-indigo-700 dark:text-indigo-400 font-extrabold">Converto is fully client-side first</strong>. All file operations, compiling, splits, merges, watermarks, image resizing, and cryptographic protection algorithms occur directly within your browser window using standard sandboxed Web APIs.
            </p>
            <p>
              No payload data, cookies, or document streams are ever dispatched to external servers, making this application ideal for strict compliance and highly sensitive documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
