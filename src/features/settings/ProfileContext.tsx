import { useState, type ReactNode } from 'react';
import { defaultProfile, ProfileContext, type Profile } from './profile';

const key = 'policymind-profile';
function loadProfile(): Profile {
  try {
    const entry = localStorage.getItem(key);
    if (!entry) return defaultProfile;
    const profile: Partial<Profile> = JSON.parse(entry);
    if (
      typeof profile.name === 'string' &&
      typeof profile.email === 'string' &&
      typeof profile.compactTables === 'boolean'
    ) {
      return { name: profile.name, email: profile.email, compactTables: profile.compactTables };
    }
  } catch {
    // A browser can block storage access or contain an invalid saved value.
  }
  return defaultProfile;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(loadProfile);

  function saveProfile(value: Profile) {
    localStorage.setItem(key, JSON.stringify(value));
    setProfile(value);
  }

  return (
    <ProfileContext.Provider value={{ profile, saveProfile }}>{children}</ProfileContext.Provider>
  );
}
