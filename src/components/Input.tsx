import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label htmlFor={id} className="input-label">{label}</label>}
        <input
          ref={ref}
          id={id}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label htmlFor={id} className="input-label">{label}</label>}
        <textarea
          ref={ref}
          id={id}
          className={`textarea ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
