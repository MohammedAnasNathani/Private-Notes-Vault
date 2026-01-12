import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notesService } from '../services/notesService';
import { NoteCard } from '../components/NoteCard';
import { Button } from '../components/Button';
import type { Note } from '../types';
import { Plus, LogOut, Lock, FileText, Loader2, Search, X } from 'lucide-react';

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { signOut, user } = useAuth();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      await notesService.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="notes-page">
      <header className="notes-header">
        <div className="notes-header-left">
          <Lock size={24} className="notes-logo" />
          <h1>Private Vault</h1>
        </div>
        <div className="notes-header-right">
          <span className="user-email">{user?.email}</span>
          <Button variant="ghost" onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <main className="notes-main">
        <div className="notes-toolbar">
          <div className="toolbar-left">
            <h2>Your Notes</h2>
            {notes.length > 0 && (
              <span className="notes-count">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <Link to="/notes/new">
            <Button>
              <Plus size={18} />
              New Note
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        {notes.length > 0 && (
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="search-clear" onClick={clearSearch}>
                  <X size={16} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="search-results">
                {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {error && <div className="notes-error">{error}</div>}

        {loading ? (
          <div className="notes-loading">
            <Loader2 className="spinner" size={32} />
            <p>Loading your notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="notes-empty">
            <div className="empty-illustration">
              <FileText size={64} className="empty-icon" />
              <div className="empty-decoration" />
            </div>
            <h3>No notes yet</h3>
            <p>Your private thoughts await. Create your first note to get started.</p>
            <Link to="/notes/new">
              <Button>
                <Plus size={18} />
                Create Note
              </Button>
            </Link>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="notes-empty">
            <Search size={48} className="empty-icon" />
            <h3>No matching notes</h3>
            <p>Try a different search term or clear the search.</p>
            <Button variant="secondary" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="note-card-wrapper">
                <NoteCard note={note} onDelete={handleDelete} />
                {deleteConfirm === note.id && (
                  <div className="delete-confirm">
                    <span>Delete this note?</span>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(note.id)}>
                      Confirm
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="notes-footer">
        <p>Your notes are private and encrypted. Only you can see them.</p>
      </footer>
    </div>
  );
}
