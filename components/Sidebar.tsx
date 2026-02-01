'use client';

import { Note } from '@/lib/types';

interface SidebarProps {
  notes: Note[];
  currentNote: Note | null;
  onSelectNote: (note: Note) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Sidebar({
  notes,
  currentNote,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🐊 AlligatorBrain
          </h1>
          <button
            onClick={onNewNote}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="New note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notes found
          </div>
        ) : (
          <div className="p-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                  currentNote?.id === note.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => onSelectNote(note)}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1">
                    {note.title || 'Untitled'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this note?')) {
                        onDeleteNote(note.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 ml-2"
                    title="Delete note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {note.content || 'No content'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDate(note.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
