'use client';

import { useState, useEffect } from 'react';
import NoteEditor from '@/components/NoteEditor';
import Sidebar from '@/components/Sidebar';
import { Note } from '@/lib/types';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('alligatorbrain-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setCurrentNote(parsedNotes[0]);
      }
    } else {
      // Create a welcome note
      const welcomeNote: Note = {
        id: Date.now().toString(),
        title: 'Welcome to AlligatorBrain',
        content: 'Start typing to create your first note...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([welcomeNote]);
      setCurrentNote(welcomeNote);
      localStorage.setItem('alligatorbrain-notes', JSON.stringify([welcomeNote]));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('alligatorbrain-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note
    ));
    if (currentNote?.id === id) {
      setCurrentNote({ ...currentNote, title, content, updatedAt: new Date().toISOString() });
    }
  };

  const deleteNote = (id: string) => {
    const filtered = notes.filter(note => note.id !== id);
    setNotes(filtered);
    if (currentNote?.id === id) {
      setCurrentNote(filtered.length > 0 ? filtered[0] : null);
    }
  };

  const selectNote = (note: Note) => {
    setCurrentNote(note);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        notes={filteredNotes}
        currentNote={currentNote}
        onSelectNote={selectNote}
        onNewNote={createNewNote}
        onDeleteNote={deleteNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 overflow-hidden">
        {currentNote ? (
          <NoteEditor
            note={currentNote}
            onUpdate={updateNote}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No note selected</h2>
              <p>Create a new note or select one from the sidebar</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
