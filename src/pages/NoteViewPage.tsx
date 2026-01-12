import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { notesService } from '../services/notesService';
import { Button } from '../components/Button';
import type { Note } from '../types';
import { ArrowLeft, Trash2, Edit, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export function NoteViewPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadNote(id);
    }
  }, [id]);

  const loadNote = async (noteId: string) => {
    try {
      setLoading(true);
      const data = await notesService.getNote(noteId);
      if (!data) {
        setError('Note not found');
      } else {
        setNote(data);
      }
    } catch (err) {
      setError('Failed to load note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    if (!id) return;

    setDeleting(true);
    try {
      await notesService.deleteNote(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const formattedDate = note ? formatDate(note.created_at) : '';

  // Calculate reading time
  const readingTime = note
    ? Math.ceil(note.content.split(/\s+/).length / 200)
    : 0;
  const readingTimeText = readingTime < 1 ? 'Less than 1 min read' : `${readingTime} min read`;

  if (loading) {
    return (
      <div className="note-view-page">
        <div className="loading-screen">
          <Loader2 className="spinner" size={32} />
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="note-view-page">
        <header className="view-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to notes</span>
          </Link>
        </header>
        <main className="view-main">
          <div className="view-error">
            <AlertTriangle size={48} />
            <h3>{error || 'Note not found'}</h3>
            <p>This note may have been deleted or doesn't exist.</p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="note-view-page">
      <header className="view-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to notes</span>
        </Link>
        <div className="view-actions">
          <Link to={`/notes/${id}/edit`}>
            <Button variant="secondary">
              <Edit size={18} />
              Edit
            </Button>
          </Link>
          {deleteConfirm ? (
            <>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                <Trash2 size={18} />
                Confirm
              </Button>
              <Button variant="ghost" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={handleDelete}>
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      </header>

      <main className="view-main">
        <article className="note-article">
          <h1 className="note-title">{note.title}</h1>
          <div className="note-meta">
            <span className="note-meta-item">
              <Clock size={14} />
              {formattedDate}
            </span>
            <span className="note-meta-divider">•</span>
            <span className="note-meta-item">{readingTimeText}</span>
          </div>
          <div className="note-content">
            {note.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index}>{paragraph}</p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
