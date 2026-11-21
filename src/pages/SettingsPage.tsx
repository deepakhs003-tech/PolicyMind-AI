import { useState, type FormEvent } from 'react';
import { PageHeading } from '../components/ui';
import { useProfile } from '../features/settings/profile';

export function SettingsPage() {
  const { profile, saveProfile } = useProfile();
  const [draft, setDraft] = useState(profile);
  const [notice, setNotice] = useState<{ error: boolean; text: string }>();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setNotice({ error: true, text: 'Enter a display name.' });
      return;
    }
    try {
      saveProfile({ ...draft, name, email: draft.email.trim() });
      setNotice({ error: false, text: 'Settings saved.' });
    } catch {
      setNotice({ error: true, text: 'Your browser could not save these settings.' });
    }
  }
  return (
    <>
      <PageHeading
        title="Settings"
        description="Manage your profile and preferences for this browser."
      />
      <form className="card settings-card" onSubmit={save} onChange={() => setNotice(undefined)}>
        <div className="card-heading">
          <div>
            <h2>Profile</h2>
            <p>Update your display name and email address.</p>
          </div>
        </div>
        <div className="form-grid settings-fields">
          <label>
            Display name
            <input
              required
              maxLength={70}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              required
              maxLength={150}
              value={draft.email}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
            />
          </label>
        </div>
        <div className="card-heading settings-section">
          <div>
            <h2>Application preferences</h2>
            <p>Adjust the density of workspace tables.</p>
          </div>
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={draft.compactTables}
            onChange={(event) => setDraft({ ...draft, compactTables: event.target.checked })}
          />{' '}
          Use compact tables
        </label>
        <div className="settings-save">
          <button type="submit" className="button primary">
            Save settings
          </button>
          {notice && (
            <p
              role={notice.error ? 'alert' : 'status'}
              className={notice.error ? 'form-error' : 'success-notice'}
            >
              {notice.text}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
