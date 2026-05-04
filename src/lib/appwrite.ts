import { Client, Databases, Account } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

export const client = new Client();

if (projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const databases = new Databases(client);
export const account = new Account(client);

export const isAppwriteConfigured = projectId.length > 0;

// Database and collection IDs (configurable via env)
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'narraterritorio';
export const COLLECTION_PROMPTS = 'prompts';
export const COLLECTION_PROJECTS = 'writing_projects';
export const COLLECTION_STUDENTS = 'students';
export const COLLECTION_SESSIONS = 'sessions';
