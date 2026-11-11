export const storageKeys = {
  authToken: 'switchmate.authToken',
  currentUser: 'switchmate.currentUser',
  profile: 'switchmate.profile',
  preferences: 'switchmate.preferences',
  standardAnswers: 'switchmate.standardAnswers',
  jobs: 'switchmate.jobs',
  applications: 'switchmate.applications',
  autoApplySettings: 'switchmate.autoApplySettings',
} as const;

export async function delay(): Promise<void> {
  const milliseconds = 300 + Math.floor(Math.random() * 301);
  await new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

export function readStorage<T>(key: string, fallback: T): T {
  const value = window.localStorage.getItem(key);
  if (value !== null) return JSON.parse(value) as T;
  writeStorage(key, fallback);
  return fallback;
}

export function writeStorage<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}
