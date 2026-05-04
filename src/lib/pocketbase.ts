import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_POCKETBASE_URL || '';

export const pb = new PocketBase(pbUrl);

export const isPocketBaseConfigured = pbUrl.length > 0;

// Helper to check if PocketBase is reachable
export async function isPbReachable(): Promise<boolean> {
  if (!isPocketBaseConfigured) return false;
  try {
    await pb.health.check();
    return true;
  } catch {
    return false;
  }
}
