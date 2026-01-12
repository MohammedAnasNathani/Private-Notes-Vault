import { AlertTriangle, ExternalLink, Database, Key, CheckCircle } from 'lucide-react';

export function SetupPage() {
  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <div className="setup-icon">
            <AlertTriangle size={32} />
          </div>
          <h1>Setup Required</h1>
          <p>Configure Supabase to get started with Private Notes Vault</p>
        </div>

        <div className="setup-steps">
          <div className="setup-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Supabase Project</h3>
              <p>
                Go to{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  supabase.com <ExternalLink size={14} />
                </a>{' '}
                and create a new project.
              </p>
            </div>
          </div>

          <div className="setup-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Run Database Migration</h3>
              <p>Go to SQL Editor and run the notes table creation script from the README.</p>
              <div className="step-icon">
                <Database size={20} />
              </div>
            </div>
          </div>

          <div className="setup-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Add Environment Variables</h3>
              <p>Create a <code>.env</code> file in the project root:</p>
              <pre className="code-block">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
              </pre>
              <div className="step-icon">
                <Key size={20} />
              </div>
            </div>
          </div>

          <div className="setup-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Restart Dev Server</h3>
              <p>
                Stop the current server and run <code>npm run dev</code> again.
              </p>
              <div className="step-icon">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="setup-footer">
          <p>Find your credentials in Supabase Dashboard → Settings → API</p>
        </div>
      </div>
    </div>
  );
}
