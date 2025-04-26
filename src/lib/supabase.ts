import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  FORM_SUBMISSIONS: 'form_submissions',
  VOICE_NOTES: 'voice_notes',
};

// Type definitions for database tables
export type FormSubmission = {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  service_type?: string;
  description?: string;
  voice_note_id?: string;
  created_at?: string;
};

export type VoiceNote = {
  id?: string;
  audio_data?: string; // Base64 encoded audio data
  transcription?: string;
  created_at?: string;
};
