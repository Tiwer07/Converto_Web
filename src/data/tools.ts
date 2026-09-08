/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tool } from '../types';

export const TOOLS: Tool[] = [
  // Image Tools
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert JPG, PNG, WEBP, and more with custom quality controls.',
    category: 'image',
    icon: 'ImageIcon',
  },
  {
    id: 'images-to-pdf',
    name: 'Images → PDF',
    description: 'Convert multiple images into a clean, unified PDF file.',
    category: 'image',
    icon: 'FileImage',
  },

  // Audio Tools
  {
    id: 'audio-converter',
    name: 'Audio Converter',
    description: 'Convert between MP3, WAV, M4A, OGG batch formats.',
    category: 'audio',
    icon: 'Music',
  },
  {
    id: 'm4a-to-mp3',
    name: 'M4A → MP3',
    description: 'Extract or transcode M4A files to high-quality MP3.',
    category: 'audio',
    icon: 'FileAudio',
  },
  {
    id: 'audio-extraction',
    name: 'Audio Extraction',
    description: 'Extract soundtracks and audio channels from video formats.',
    category: 'audio',
    icon: 'Volume2',
  },

  // Video Tools
  {
    id: 'mov-to-mp4',
    name: 'MOV → MP4',
    description: 'Convert Apple MOV video files into widely-supported MP4.',
    category: 'video',
    icon: 'Video',
  },
  {
    id: 'mov-to-mp3',
    name: 'MOV → MP3',
    description: 'Directly extract audio tracks from MOV video files.',
    category: 'video',
    icon: 'VideoOff',
  },
  {
    id: 'mp4-to-mp3',
    name: 'MP4 → MP3',
    description: 'Extract clear MP3 soundtracks from MP4 video files.',
    category: 'video',
    icon: 'Disc',
  },

  // PDF Tools
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF documents into a single file.',
    category: 'pdf',
    icon: 'Merge',
  },
  {
    id: 'pdf-split',
    name: 'Split PDF',
    description: 'Extract selected pages or custom ranges from a PDF.',
    category: 'pdf',
    icon: 'Scissors',
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    description: 'Reduce the file size of your PDF while optimizing quality.',
    category: 'pdf',
    icon: 'FileDown',
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF',
    description: 'Rotate specific pages or all pages of a PDF by 90°, 180°, or 270°.',
    category: 'pdf',
    icon: 'RotateCw',
  },
  {
    id: 'pdf-rearrange',
    name: 'Rearrange PDF',
    description: 'Drag and drop PDF pages to visual reorder or delete pages.',
    category: 'pdf',
    icon: 'LayoutGrid',
  },
  {
    id: 'pdf-watermark',
    name: 'Watermark PDF',
    description: 'Add custom text watermark with controls for transparency and rotation.',
    category: 'pdf',
    icon: 'Type',
  },
  {
    id: 'pdf-page-numbers',
    name: 'Add Page Numbers',
    description: 'Insert clear page counters at your choice of layout corners.',
    category: 'pdf',
    icon: 'Hash',
  },
  {
    id: 'pdf-sign',
    name: 'Sign PDF',
    description: 'Draw or upload signatures and place them interactively on PDF pages.',
    category: 'pdf',
    icon: 'Signature',
  },
  {
    id: 'pdf-protect',
    name: 'Protect PDF',
    description: 'Encrypt your PDF with strong AES-GCM user password protection.',
    category: 'pdf',
    icon: 'Lock',
  },
  {
    id: 'pdf-unlock',
    name: 'Unlock PDF',
    description: 'Remove password protection from encrypted PDF documents.',
    category: 'pdf',
    icon: 'Unlock',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF → Image',
    description: 'Convert PDF pages into individual JPG, PNG, or WEBP images.',
    category: 'pdf',
    icon: 'FileOutput',
  },
  {
    id: 'pdf-extract-images',
    name: 'Extract Images',
    description: 'Harvest and extract all embedded images from inside a PDF.',
    category: 'pdf',
    icon: 'ImageDown',
  },
  {
    id: 'pdf-to-text',
    name: 'PDF → Text',
    description: 'Extract content strings and text lines into plain TXT format.',
    category: 'pdf',
    icon: 'FileText',
  },

  // Document Tools
  {
    id: 'txt-to-pdf',
    name: 'TXT → PDF',
    description: 'Convert raw text files into clean formatted PDF documents.',
    category: 'document',
    icon: 'FileCode',
  },
  {
    id: 'ebf-to-pdf',
    name: 'EBF → PDF',
    description: 'Convert EBF documents into standard reader PDF documents.',
    category: 'document',
    icon: 'BookOpen',
  },
  {
    id: 'ebf-to-image',
    name: 'EBF → Image',
    description: 'Render and save pages of EBF documents as clean images.',
    category: 'document',
    icon: 'FileSymlink',
  },
];
