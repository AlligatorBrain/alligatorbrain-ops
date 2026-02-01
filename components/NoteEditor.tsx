'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/lib/types';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, title: string, content: string) => void;
}

export default function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate(note.id, newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate(note.id, title, newContent);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full text-4xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
          placeholder="Untitled"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Last edited {formatDate(note.updatedAt)}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-full p-6 text-lg bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}
