import React, { useState } from 'react';
import {
  FileEdit,
  Plus,
  Search,
  BookOpen,
  FolderOpen,
  Tag,
  Star,
  Pin,
  Sparkles,
  Layers,
  RotateCw,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Note, Flashcard } from '../../types';

export const NotesView: React.FC = () => {
  const {
    notes,
    courses,
    flashcards,
    addNote,
    updateNote,
    deleteNote,
    addFlashcard,
    updateFlashcardReview,
    setIsQuickAddOpen,
    todayDateStr,
  } = useApp();

  const safeFlashcards = flashcards || [];
  const safeNotes = notes || [];
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards'>('notes');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(safeNotes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  // Flashcard review mode state
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const selectedNote = safeNotes.find(n => n.id === selectedNoteId) || safeNotes[0];
  const selectedNoteCourse = (courses || []).find(c => c.id === selectedNote?.courseId);

  // Filter notes
  const filteredNotes = safeNotes.filter(n => {
    if (selectedCourseFilter !== 'all' && n.courseId !== selectedCourseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateNewNote = () => {
    const newNote = addNote({
      title: 'Untitled Lecture Notes',
      content: '# Untitled Lecture Notes\n\n- Key concepts:\n- References:',
      courseId: (courses || [])[0]?.id,
      folder: 'Lectures',
      tags: ['notes'],
      isPinned: false,
      isFavorite: false,
    });
    if (newNote) setSelectedNoteId(newNote.id);
  };

  const handleFlashcardRating = (rating: 'easy' | 'good' | 'hard') => {
    if (!safeFlashcards[currentCardIndex]) return;
    updateFlashcardReview(safeFlashcards[currentCardIndex].id, rating);
    setIsCardFlipped(false);
    if (currentCardIndex + 1 < safeFlashcards.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsReviewing(false);
      setCurrentCardIndex(0);
    }
  };

  return (
    <div id="notes-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Academic Notes & Spaced Repetition
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Course lecture summaries, theorem cheat sheets, and active recall flashcards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium text-slate-400">
            <button
              onClick={() => {
                setActiveTab('notes');
                setIsReviewing(false);
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'notes' ? 'bg-slate-800 text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Notes ({safeNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'flashcards' ? 'bg-slate-800 text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Flashcards ({safeFlashcards.length})
            </button>
          </div>

          {activeTab === 'notes' ? (
            <button
              onClick={handleCreateNewNote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsReviewing(true);
                setCurrentCardIndex(0);
                setIsCardFlipped(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Start Recall Review</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: NOTES BROWSER & EDITOR */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Notes Sidebar List (4 cols) */}
          <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              {/* Search & Course Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search notes or keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={selectedCourseFilter}
                onChange={e => setSelectedCourseFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>

              {/* Note Item List */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                {filteredNotes.map(note => {
                  const isSelected = selectedNote?.id === note.id;
                  const c = courses.find(course => course.id === note.courseId);

                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/30 text-slate-100'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono">{c?.code || 'General'}</span>
                        <span>{note.updatedAt}</span>
                      </div>
                      <h4 className="text-xs font-bold truncate text-slate-100">{note.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-mono">
                        {note.content.replace(/[#*`]/g, '')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono text-center pt-2 border-t border-slate-800">
              Auto-saved to local university registry
            </div>
          </div>

          {/* Notes Editor (8 cols) */}
          <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex flex-col space-y-4 shadow-xl">
            {selectedNote ? (
              <>
                {/* Title and metadata */}
                <div className="border-b border-slate-800 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedNote.courseId || ''}
                        onChange={e => updateNote(selectedNote.id, { courseId: e.target.value })}
                        className="text-xs bg-slate-900 border border-slate-800 text-amber-400 font-semibold rounded px-2 py-1 focus:outline-none"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] font-mono text-slate-400">
                        Updated {selectedNote.updatedAt}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete note?')) deleteNote(selectedNote.id);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Delete Note
                    </button>
                  </div>

                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={e => updateNote(selectedNote.id, { title: e.target.value })}
                    className="w-full text-xl font-black text-slate-100 bg-transparent focus:outline-none"
                    placeholder="Note Title..."
                  />
                </div>

                {/* Markdown Content Area */}
                <div className="flex-1 min-h-[350px]">
                  <textarea
                    value={selectedNote.content}
                    onChange={e => updateNote(selectedNote.id, { content: e.target.value })}
                    className="w-full h-full min-h-[350px] bg-transparent text-slate-200 text-xs leading-relaxed focus:outline-none font-mono resize-none"
                    placeholder="Type markdown notes, code blocks, or mathematical definitions..."
                  />
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500">Select a note to inspect and edit.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FLASHCARDS & SPACED REPETITION */}
      {activeTab === 'flashcards' && (
        <div>
          {!isReviewing ? (
            /* Flashcards Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {safeFlashcards.length} Total Flashcards across all subjects
                </span>
                <button
                  onClick={() => {
                    setIsReviewing(true);
                    setCurrentCardIndex(0);
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Start Recall Practice ({safeFlashcards.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {safeFlashcards.map(card => {
                  const c = (courses || []).find(course => course.id === card.courseId);
                  return (
                    <div
                      key={card.id}
                      className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-amber-400 font-bold">{c?.code}</span>
                        <span>Interval: {card.intervalDays}d • Reps: {card.repetitions}</span>
                      </div>
                      <h4 className="font-bold text-slate-200">{card.front}</h4>
                      <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800 font-mono">
                        {card.back}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Flashcard Reviewer */
            <div className="max-w-xl mx-auto space-y-6 text-center py-6">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>
                  Card {currentCardIndex + 1} of {safeFlashcards.length}
                </span>
                <button
                  onClick={() => setIsReviewing(false)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Exit Review
                </button>
              </div>

              {/* Card Container */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="min-h-[260px] p-8 rounded-2xl bg-[#0f172a] border border-amber-500/30 flex flex-col items-center justify-center space-y-4 shadow-2xl cursor-pointer hover:border-amber-400 transition-all"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  {isCardFlipped ? 'Answer' : 'Question (Click to Flip)'}
                </span>

                <div className="text-lg font-bold text-slate-100 max-w-md">
                  {isCardFlipped
                    ? safeFlashcards[currentCardIndex]?.back
                    : safeFlashcards[currentCardIndex]?.front}
                </div>

                <div className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click to flip card</span>
                </div>
              </div>

              {/* Rating Buttons */}
              {isCardFlipped && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleFlashcardRating('hard')}
                    className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/50 text-xs font-bold cursor-pointer"
                  >
                    Hard (Review Soon)
                  </button>
                  <button
                    onClick={() => handleFlashcardRating('good')}
                    className="px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-900/50 text-xs font-bold cursor-pointer"
                  >
                    Good (Normal)
                  </button>
                  <button
                    onClick={() => handleFlashcardRating('easy')}
                    className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/50 text-xs font-bold cursor-pointer"
                  >
                    Easy (Mastered)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
