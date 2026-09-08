/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TabId } from '../types';
import { Icon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  queueCount: number;
}

export function Sidebar({ activeTab, setActiveTab, queueCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'home' as TabId, label: 'Home', icon: 'Home' },
    { id: 'image-tools' as TabId, label: 'Image Tools', icon: 'Image' },
    { id: 'audio-tools' as TabId, label: 'Audio Tools', icon: 'Music' },
    { id: 'video-tools' as TabId, label: 'Video Tools', icon: 'Video' },
    { id: 'pdf-tools' as TabId, label: 'PDF Tools', icon: 'FileText' },
    { id: 'document-tools' as TabId, label: 'Document Tools', icon: 'BookOpen' },
  ];

  const secondaryNavItems = [
    { id: 'queue' as TabId, label: 'Queue', icon: 'Layers', count: queueCount },
    { id: 'history' as TabId, label: 'History', icon: 'History' },
    { id: 'favorites' as TabId, label: 'Favorites', icon: 'Star' },
    { id: 'settings' as TabId, label: 'Settings', icon: 'Settings' },
  ];

  const handleNavClick = (id: TabId) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } min-h-screen sticky top-0`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3 select-none">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
                <Icon name="RefreshCw" size={20} className="animate-spin-slow text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300">
                  Converto
                </span>
                <span className="block text-[10px] text-neutral-400 dark:text-neutral-500 font-medium tracking-widest uppercase mt-[-2px]">
                  Web Edition
                </span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
              <Icon name="RefreshCw" size={20} />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-7 scrollbar-thin">
          {/* Main Tools Group */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[11px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                Categories
              </span>
            )}
            <ul className="mt-2 space-y-1">
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'
                      } rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Icon name={item.icon} size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* System & History Group */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[11px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                Workspace
              </span>
            )}
            <ul className="mt-2 space-y-1">
              {secondaryNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'
                      } rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Icon name={item.icon} size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}

                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={`absolute ${
                            collapsed ? 'top-1 right-1' : 'right-3'
                          } bg-red-500 text-white font-bold rounded-full ${
                            collapsed ? 'w-4 h-4 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'
                          } flex items-center justify-center`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Profile / Info */}
        {!collapsed && (
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-xl p-3">
              <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                100% Client-Side Mode
              </span>
              <span className="block text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                Your files never leave your device
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Icon name="RefreshCw" size={16} />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300">
            Converto
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        >
          <Icon name="Menu" size={22} />
        </button>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-neutral-900 shadow-2xl z-50 p-5 flex flex-col h-full border-l border-neutral-100 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    Categories
                  </span>
                  <ul className="mt-2 space-y-1">
                    {mainNavItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                              isActive
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <Icon name={item.icon} size={20} />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    System
                  </span>
                  <ul className="mt-2 space-y-1">
                    {secondaryNavItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold relative ${
                              isActive
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <Icon name={item.icon} size={20} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.count !== undefined && item.count > 0 && (
                              <span className="bg-red-500 text-white font-bold rounded-full px-1.5 py-0.5 text-[10px]">
                                {item.count}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 text-center">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  Converto v1.0 • Privacy Preserved
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar (Thumb-Friendly, Highly Native-feeling) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-40 flex items-center justify-around px-2 pb-safe">
        {[
          { id: 'home' as TabId, label: 'Home', icon: 'Home' },
          { id: 'pdf-tools' as TabId, label: 'PDFs', icon: 'FileText' },
          { id: 'queue' as TabId, label: 'Queue', icon: 'Layers', count: queueCount },
          { id: 'history' as TabId, label: 'History', icon: 'History' },
          { id: 'settings' as TabId, label: 'Settings', icon: 'Settings' },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <div className="p-1 rounded-full relative">
                <Icon name={item.icon} size={20} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
