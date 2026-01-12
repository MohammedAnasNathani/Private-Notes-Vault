import type { FormEvent } from 'react';
import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notesService } from '../services/notesService';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function CreateNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSave = async () => {
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);

    try {
      await notesService.createNote(title.trim(), content.trim());
      navigate('/');
    } catch (err) {
      setError('Failed to create note');
      console.error(err);
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 's', ctrlKey: true, handler: handleSave },
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  // Word and character count
  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    return { words, chars };
  }, [content]);

  return (
    <div className="note-editor-page">
      <header className="editor-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to notes</span>
        </Link>
      </header>

      <main className="editor-main">
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-title-row">
            <h1>New Note</h1>
            <span className="keyboard-hint">Ctrl+S to save</span>
          </div>
          
          {error && <div className="editor-error">{error}</div>}

          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title-input"
            autoFocus
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
            </div>
            <div className="editor-actions">
              <Button type="button" variant="ghost" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                <Save size={18} />
                Save Note
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
