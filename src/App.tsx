/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabId, QueueItem, HistoryItem, AppSettings } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './components/Workspace';
import { QueuePage } from './components/QueuePage';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [preselectedFiles, setPreselectedFiles] = useState<File[]>([]);

  // Persistent States with local storage fallback
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('converto_favorites');
    return saved ? JSON.parse(saved) : ['image-converter', 'pdf-merge', 'pdf-split'];
  });

  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    const saved = localStorage.getItem('converto_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const saved = localStorage.getItem('converto_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('converto_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('converto_settings');
    return saved
      ? JSON.parse(saved)
      : {
          appearance: 'system',
          autoDownload: true,
          confirmDelete: true,
          rememberRecent: true,
        };
  });

  const [isQueuePaused, setIsQueuePaused] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('converto_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('converto_recent', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  useEffect(() => {
    localStorage.setItem('converto_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('converto_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('converto_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Dynamic Theme Switching (Light/Dark/System Default)
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        settings.appearance === 'dark' ||
        (settings.appearance === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    // Listen to changes in system preferences if on system mode
    const systemMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (settings.appearance === 'system') {
        applyTheme();
      }
    };

    systemMatcher.addEventListener('change', handleSystemChange);
    return () => {
      systemMatcher.removeEventListener('change', handleSystemChange);
    };
  }, [settings.appearance]);

  // Handle Queue processing simulation
  useEffect(() => {
    if (isQueuePaused || queue.length === 0) return;

    // Find the next item waiting to be processed
    const nextIndex = queue.findIndex((item) => item.status === 'waiting');
    if (nextIndex === -1) return;

    const targetItem = queue[nextIndex];

    // Mark as processing
    setQueue((prev) =>
      prev.map((item, idx) =>
        idx === nextIndex ? { ...item, status: 'processing', step: 'Loading document...' } : item
      )
    );

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;

      if (currentProgress >= 100) {
        clearInterval(interval);

        // Complete processing
        setQueue((prev) =>
          prev.map((item, idx) =>
            idx === nextIndex
              ? {
                  ...item,
                  status: 'completed',
                  progress: 100,
                  step: 'Ready for download',
                }
              : item
          )
        );

        // Add to history
        const newHistoryItem: HistoryItem = {
          id: Math.random().toString(36).substring(7),
          fileName: targetItem.fileName,
          operation: `Queue: ${targetItem.toolId.replace('-', ' ').toUpperCase()}`,
          timestamp: Date.now(),
          status: 'completed',
          outputFormat: 'PDF',
          outputSize: targetItem.fileSize,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);

        // Auto download if preference is enabled
        if (settings.autoDownload) {
          const mockLink = document.createElement('a');
          // Since it's a simulated enqueued task, we download a clean sample text wrapper
          const contentBlob = new Blob([`Converto Queue Output: ${targetItem.fileName}`], {
            type: 'text/plain',
          });
          mockLink.href = URL.createObjectURL(contentBlob);
          mockLink.download = `${targetItem.fileName.split('.')[0]}_processed.pdf`;
          document.body.appendChild(mockLink);
          mockLink.click();
          document.body.removeChild(mockLink);
        }
      } else {
        // Increment progress & step descriptions
        let currentStep = 'Applying core configurations...';
        if (currentProgress < 30) currentStep = 'Parsing file bytes...';
        else if (currentProgress < 70) currentStep = 'Applying custom filters...';
        else if (currentProgress < 90) currentStep = 'Rebuilding output container...';

        setQueue((prev) =>
          prev.map((item, idx) =>
            idx === nextIndex
              ? {
                  ...item,
                  progress: currentProgress,
                  step: currentStep,
                }
              : item
          )
        );
      }
    }, 250);

    return () => clearInterval(interval);
  }, [queue, isQueuePaused, settings.autoDownload]);

  // Callbacks
  const handleSelectTool = (toolId: string, preselected?: File[]) => {
    setActiveToolId(toolId);
    if (preselected) {
      setPreselectedFiles(preselected);
    } else {
      setPreselectedFiles([]);
    }

    // Add to recently used
    if (settings.rememberRecent) {
      setRecentlyUsed((prev) => {
        const filtered = prev.filter((id) => id !== toolId);
        return [toolId, ...filtered].slice(0, 10);
      });
    }
  };

  const handleToggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  const handleAddHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const handleAddQueue = (selectedFiles: File[], toolId: string, options: any) => {
    const newItems = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      toolId,
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
      status: 'waiting' as const,
      step: 'Waiting in line',
      timestamp: Date.now(),
    }));

    setQueue((prev) => [...prev, ...newItems]);
    setActiveTab('queue');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Page Routing Router logic
  const renderTabContent = () => {
    if (activeToolId) {
      return (
        <Workspace
          toolId={activeToolId}
          initialFiles={preselectedFiles}
          onBack={() => setActiveToolId(null)}
          onAddHistory={handleAddHistory}
          onAddQueue={handleAddQueue}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <Dashboard
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyUsed={recentlyUsed}
          />
        );
      case 'image-tools':
        return (
          <Dashboard
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyUsed={recentlyUsed}
            categoryFilter="image"
          />
        );
      case 'audio-tools':
        return (
          <Dashboard
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyUsed={recentlyUsed}
            categoryFilter="audio"
          />
        );
      case 'video-tools':
        return (
          <Dashboard
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyUsed={recentlyUsed}
            categoryFilter="video"
          />
        );
      case 'pdf-tools':
        return (
          <Dashboard
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyUsed={recentlyUsed}
            categoryFilter="pdf"
          />
        );
      case 'document-tools':
        return (
          <Dashboard
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyUsed={recentlyUsed}
            categoryFilter="document"
          />
        );
      case 'queue':
        return (
          <QueuePage
            queue={queue}
            setQueue={setQueue}
            isQueuePaused={isQueuePaused}
            setIsQueuePaused={setIsQueuePaused}
          />
        );
      case 'history':
        return (
          <HistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onOpenTool={handleSelectTool}
          />
        );
      case 'favorites':
        return (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Your Favorites</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                A single-view hub of your enqueued favorite tools.
              </p>
            </div>
            <Dashboard
              onSelectTool={handleSelectTool}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              recentlyUsed={recentlyUsed}
              // Category filter is undefined, but Dashboard handles showing Favorites beautifully!
            />
          </div>
        );
      case 'settings':
        return <SettingsPage settings={settings} setSettings={setSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeToolId ? (null as any) : activeTab}
        setActiveTab={(tab) => {
          setActiveToolId(null);
          setActiveTab(tab);
        }}
        queueCount={queue.filter((item) => item.status === 'waiting' || item.status === 'processing').length}
      />

      {/* Main Page Content */}
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-8">
        <div className="container mx-auto max-w-7xl">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
