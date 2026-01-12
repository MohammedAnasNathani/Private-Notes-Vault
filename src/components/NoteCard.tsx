import { Link } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';
import type { Note } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const timeAgo = formatTimeAgo(note.created_at);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };

  // Generate a subtle gradient based on note id for visual variety
  const gradientIndex = note.id.charCodeAt(0) % 5;
  const gradients = [
    'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
    'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, transparent 50%)',
    'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, transparent 50%)',
    'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, transparent 50%)',
    'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
  ];

  return (
    <Link to={`/notes/${note.id}`} className="note-card" style={{ background: gradients[gradientIndex] }}>
      <div className="note-card-content">
        <h3 className="note-card-title">{note.title}</h3>
        <p className="note-card-preview">
          {note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}
        </p>
        <div className="note-card-footer">
          <span className="note-card-date">
            <Clock size={12} />
            {timeAgo}
          </span>
          {onDelete && (
            <button
              className="note-card-delete"
              onClick={handleDelete}
              aria-label="Delete note"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
