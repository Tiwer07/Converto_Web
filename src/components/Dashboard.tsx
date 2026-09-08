/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { TOOLS } from '../data/tools';
import { Tool, ToolCategory } from '../types';
import { Icon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  onSelectTool: (toolId: string, preselectedFiles?: File[]) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  recentlyUsed: string[];
  categoryFilter?: ToolCategory; // Used if navigated via Sidebar Category
}

export function Dashboard({
  onSelectTool,
  favorites,
  onToggleFavorite,
  recentlyUsed,
  categoryFilter,
}: DashboardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on category
  const filteredTools = categoryFilter
    ? TOOLS.filter((t) => t.category === categoryFilter)
    : TOOLS;

  // Favorites list
  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.id));

  // Recently used list
  const recentTools = TOOLS.filter((t) => recentlyUsed.includes(t.id)).slice(0, 4);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDraggedFiles(files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setDraggedFiles(files);
    }
  };

  const handleSelectSuggestedTool = (toolId: string) => {
    onSelectTool(toolId, draggedFiles);
    setDraggedFiles([]);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Check file types to suggest corresponding tools
  const getSuggestedTools = (files: File[]): Tool[] => {
    if (files.length === 0) return [];
    const firstFile = files[0];
    const extension = firstFile.name.split('.').pop()?.toLowerCase();

    const isImage = firstFile.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(extension || '');
    const isAudio = firstFile.type.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(extension || '');
    const isVideo = firstFile.type.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv'].includes(extension || '');
    const isPdf = firstFile.type === 'application/pdf' || extension === 'pdf';
    const isTxt = extension === 'txt';
    const isEbf = extension === 'ebf';

    if (isImage) {
      return TOOLS.filter((t) => t.id === 'image-converter' || t.id === 'images-to-pdf');
    }
    if (isAudio) {
      return TOOLS.filter((t) => t.id === 'audio-converter' || t.id === 'm4a-to-mp3' || t.id === 'audio-extraction');
    }
    if (isVideo) {
      return TOOLS.filter((t) => t.id === 'mov-to-mp4' || t.id === 'mov-to-mp3' || t.id === 'mp4-to-mp3');
    }
    if (isPdf) {
      return TOOLS.filter((t) => t.category === 'pdf');
    }
    if (isTxt) {
      return TOOLS.filter((t) => t.id === 'txt-to-pdf');
    }
    if (isEbf) {
      return TOOLS.filter((t) => t.id === 'ebf-to-pdf' || t.id === 'ebf-to-image');
    }

    return TOOLS.slice(0, 3); // Fallback to first 3 tools if type is unknown
  };

  // Group tools by categories for standard home view
  const categories: { key: ToolCategory; label: string; icon: string; bg: string; text: string }[] = [
    { key: 'image', label: 'Image Tools', icon: 'Image', bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { key: 'audio', label: 'Audio Tools', icon: 'Music', bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-600 dark:text-blue-400' },
    { key: 'video', label: 'Video Tools', icon: 'Video', bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-600 dark:text-rose-400' },
    { key: 'pdf', label: 'PDF Expert', icon: 'FileText', bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-600 dark:text-purple-400' },
    { key: 'document', label: 'Document Tools', icon: 'BookOpen', bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 py-8">
      {/* Title Hero Banner */}
      {!categoryFilter && draggedFiles.length === 0 && (
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Converto
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            Convert, compress, and process your files quickly and effortlessly.
          </p>
        </div>
      )}

      {/* If category filter is active, show Category Header */}
      {categoryFilter && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${categories.find(c => c.key === categoryFilter)?.bg}`}>
              <Icon name={categories.find(c => c.key === categoryFilter)?.icon || 'HelpCircle'} size={24} className={categories.find(c => c.key === categoryFilter)?.text} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white capitalize">
                {categories.find(c => c.key === categoryFilter)?.label || categoryFilter}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Premium single-view utilities for {categoryFilter} processing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Drag & Drop Upload Zone */}
      <AnimatePresence mode="wait">
        {draggedFiles.length === 0 ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md scale-[0.99]'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/60 shadow-sm'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <div className="max-w-md mx-auto space-y-4 select-none">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
                <Icon name="Upload" size={28} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  Drop your files here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Supports Images, Audio, Videos, PDFs, and Documents
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {['PNG', 'JPG', 'WEBP', 'PDF', 'MP3', 'WAV', 'MP4', 'MOV', 'TXT'].map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-500 dark:text-neutral-400"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Smart file selection tool selector layout */
          <motion.div
            key="selector"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-indigo-50/60 dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider mb-2">
                  Files Uploaded
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Intelligent Tool Recommendation
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  We detected {draggedFiles.length} file{draggedFiles.length > 1 ? 's' : ''}. Select a specialized tool to process them:
                </p>
              </div>
              <button
                onClick={() => setDraggedFiles([])}
                className="p-1.5 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-neutral-500"
                title="Cancel upload"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* List of uploaded files */}
            <div className="max-h-40 overflow-y-auto border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-2xl p-3 divide-y divide-neutral-50 dark:divide-neutral-900">
              {draggedFiles.map((file, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 overflow-hidden pr-4">
                    <Icon name="FileText" size={18} className="text-indigo-500 shrink-0" />
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>

            {/* Suggested tools list */}
            <div>
              <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-3">
                Recommended Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {getSuggestedTools(draggedFiles).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectSuggestedTool(tool.id)}
                    className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl text-left transition-all duration-200 hover:shadow-sm flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon name={tool.icon} size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 block truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tool.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block truncate">
                        {tool.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Your Favorites section if favorites exist */}
      {!categoryFilter && favoriteTools.length > 0 && draggedFiles.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <Icon name="Star" size={18} className="text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100">
              Your Favorites
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Used Section */}
      {!categoryFilter && recentTools.length > 0 && draggedFiles.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <Icon name="Clock" size={18} className="text-indigo-500" />
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100">
              Recently Used
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories / Tools List Section */}
      <div className="space-y-8">
        {!categoryFilter ? (
          categories.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat.key);
            return (
              <div key={cat.key} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bg}`}>
                    <Icon name={cat.icon} size={16} className={cat.text} />
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100">
                    {cat.label}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onSelect={onSelectTool}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ToolCard Subcomponent */
interface ToolCardProps {
  key?: string;
  tool: Tool;
  onSelect: (toolId: string, preselectedFiles?: File[]) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  compact?: boolean;
}

function ToolCard({ tool, onSelect, isFavorite, onToggleFavorite, compact = false }: ToolCardProps) {
  // Category colors maps
  const colorMap: Record<string, { bg: string; text: string }> = {
    image: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-400' },
    audio: { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-600 dark:text-blue-400' },
    video: { bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-600 dark:text-rose-400' },
    pdf: { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-600 dark:text-purple-400' },
    document: { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-400' },
  };

  const colors = colorMap[tool.category] || { bg: 'bg-neutral-50 dark:bg-neutral-800', text: 'text-neutral-600 dark:text-neutral-400' };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 hover:border-neutral-200 dark:hover:border-neutral-700 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between h-full min-h-[140px]">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(tool.id);
        }}
        className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 text-neutral-400 hover:text-yellow-500 transition-colors z-10"
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <Icon
          name="Star"
          size={16}
          className={`${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-400'}`}
        />
      </button>

      {/* Main Content */}
      <div className="space-y-3 cursor-pointer" onClick={() => onSelect(tool.id)}>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
          <Icon name={tool.icon} size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight text-[15px]">
            {tool.name}
          </h4>
          {!compact && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-medium">
              {tool.description}
            </p>
          )}
        </div>
      </div>

      {/* Call to Action Footer */}
      {!compact && (
        <button
          onClick={() => onSelect(tool.id)}
          className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors cursor-pointer w-fit"
        >
          Open Tool
          <Icon name="ChevronRight" size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
