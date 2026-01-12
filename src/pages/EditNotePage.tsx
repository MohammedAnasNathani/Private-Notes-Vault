import type { FormEvent } from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { notesService } from '../services/notesService';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import type { Note } from '../types';
import { ArrowLeft, Save, Loader2, RotateCcw, Cloud, CloudOff } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function EditNotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Store original values to detect changes and allow reset
  const originalTitle = useRef('');
  const originalContent = useRef('');
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadNote(id);
    }
  }, [id]);

  // Track if there are unsaved changes
  useEffect(() => {
    const changed = title !== originalTitle.current || content !== originalContent.current;
    setHasChanges(changed);
  }, [title, content]);

  // Auto-save effect - only triggers after user has manually saved once
  useEffect(() => {
    if (!autoSaveEnabled || !hasChanges || !id) return;
    if (!title.trim() || !content.trim()) return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus('saving');
      try {
        await notesService.updateNote(id, title.trim(), content.trim());
        originalTitle.current = title.trim();
        originalContent.current = content.trim();
        setHasChanges(false);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch {
        setAutoSaveStatus('error');
      }
    }, 2000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [title, content, autoSaveEnabled, hasChanges, id]);

  const loadNote = async (noteId: string) => {
    try {
      setLoading(true);
      const data = await notesService.getNote(noteId);
      if (!data) {
        setError('Note not found');
      } else {
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
        originalTitle.current = data.title;
        originalContent.current = data.content;
      }
    } catch (err) {
      setError('Failed to load note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!title.trim() || !content.trim() || !id) return;

    setSaving(true);
    setError('');

    try {
      await notesService.updateNote(id, title.trim(), content.trim());
      // Update original values after successful save
      originalTitle.current = title.trim();
      originalContent.current = content.trim();
      setHasChanges(false);
      // Enable auto-save after first manual save
      setAutoSaveEnabled(true);
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (err) {
      setError('Failed to update note');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [id, title, content]);

  const handleReset = () => {
    setTitle(originalTitle.current);
    setContent(originalContent.current);
    setError('');
  };

  const handleCancel = () => {
    // Clear any pending auto-save
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    // Simply navigate back - no changes are saved
    navigate(`/notes/${id}`);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 's', ctrlKey: true, handler: handleSave },
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    await handleSave();
    navigate(`/notes/${id}`);
  };

  // Word and character count
  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    return { words, chars };
  }, [content]);

  // Reading time estimate
  const readingTime = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? 'Less than 1 min read' : `${minutes} min read`;
  }, [content]);

  if (loading) {
    return (
      <div className="note-editor-page">
        <div className="loading-screen">
          <Loader2 className="spinner" size={32} />
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="note-editor-page">
        <header className="editor-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to notes</span>
          </Link>
        </header>
        <main className="editor-main">
          <div className="editor-error">{error}</div>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="note-editor-page">
      <header className="editor-header">
        <Link to={`/notes/${id}`} className="back-link" onClick={(e) => {
          e.preventDefault();
          handleCancel();
        }}>
          <ArrowLeft size={20} />
          <span>Back to note</span>
        </Link>
        <div className="editor-status">
          {autoSaveStatus === 'saving' && (
            <span className="status-saving">
              <Cloud size={16} className="pulse" />
              Saving...
            </span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="status-saved">
              <Cloud size={16} />
              Saved
            </span>
          )}
          {autoSaveStatus === 'error' && (
            <span className="status-error">
              <CloudOff size={16} />
              Error
            </span>
          )}
          {autoSaveStatus === 'idle' && hasChanges && (
            <span className="status-unsaved">
              Unsaved changes
            </span>
          )}
          {autoSaveEnabled && autoSaveStatus === 'idle' && !hasChanges && (
            <span className="status-idle">
              Auto-save on
            </span>
          )}
        </div>
      </header>

      <main className="editor-main">
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-title-row">
            <h1>Edit Note</h1>
            <div className="editor-hints">
              {hasChanges && (
                <button type="button" className="reset-btn" onClick={handleReset}>
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}
              <span className="keyboard-hint">Ctrl+S to save</span>
            </div>
          </div>

          {error && <div className="editor-error">{error}</div>}

          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title-input"
          />

          <Textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="editor-content-input"
            rows={12}
          />

          <div className="editor-footer">
            <div className="editor-stats">
              <span>{stats.words} words</span>
              <span>•</span>
              <span>{stats.chars} characters</span>
              <span>•</span>
              <span>{readingTime}</span>
            </div>
            <div className="editor-actions">
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" loading={saving} disabled={!hasChanges && autoSaveEnabled}>
                <Save size={18} />
                {autoSaveEnabled ? 'Save & Close' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
