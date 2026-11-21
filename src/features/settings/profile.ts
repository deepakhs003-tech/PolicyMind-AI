import { createContext, useContext } from 'react';

export interface Profile {
  name: string;
  email: string;
  compactTables: boolean;
}

export const defaultProfile: Profile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  compactTables: false,
};
export const ProfileContext = createContext<{
  profile: Profile;
  saveProfile: (profile: Profile) => void;
}>({
  profile: defaultProfile,
  saveProfile: () => undefined,
});

export function useProfile() {
  return useContext(ProfileContext);
}
