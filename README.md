# 🔐 Private Notes Vault

A private, authenticated notes web app where each user can securely create and view their own notes only.

## ✨ Features

### 🔐 Authentication
- Email + Password Sign Up/Login
- Google OAuth (Sign in with Google)
- Protected routes - unauthenticated users cannot access notes

### 📝 Notes
- Create, View, Edit, Delete notes
- Each note has Title, Content, and Created Timestamp
- Notes are private - users can only see their own notes
- Row Level Security enforced at database level

### 🎨 UI/UX
- Dark, distraction-free theme
- Mobile responsive design
- Smooth transitions and animations
- Search/filter notes
- Keyboard shortcuts (Ctrl+S)
- Word count, character count, reading time

### 💾 Bonus Features
- Edit notes functionality
- Smart auto-save (activates after first manual save)
- Time-ago timestamps ("5m ago", "2d ago")
- Unsaved changes indicator

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Vanilla CSS
- **Backend/Auth:** Supabase
- **Icons:** Lucide React
- **Routing:** React Router

## 📁 Project Structure

```
src/
├── components/   # Button, Input, NoteCard, ProtectedRoute
├── contexts/     # AuthContext
├── hooks/        # useAutoSave, useKeyboardShortcuts
├── lib/          # Supabase client
├── pages/        # Login, Signup, Notes, CreateNote, EditNote, ViewNote
├── services/     # notesService (CRUD operations)
├── types/        # TypeScript interfaces
└── utils/        # Date formatting utilities
```

## 🚀 Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions including:
- Supabase configuration
- Google OAuth setup
- Netlify deployment

## 🔒 Security

- **Row Level Security (RLS)** - Database enforces that users can only access their own notes
- **Protected Routes** - Frontend redirects unauthenticated users to login
- **Supabase Auth** - Secure authentication handling

## 📄 License

MIT

---

Built for the AtoZ Demand Full-Stack Internship Assignment
