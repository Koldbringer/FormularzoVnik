-- Create voice_notes table
CREATE TABLE IF NOT EXISTS voice_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audio_data TEXT,
  transcription TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  service_type TEXT,
  description TEXT,
  voice_note_id UUID REFERENCES voice_notes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_voice_notes_created_at ON voice_notes(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow full access to authenticated users"
  ON voice_notes FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow full access to authenticated users"
  ON form_submissions FOR ALL
  TO authenticated
  USING (true);

-- Create policies for anonymous users (insert only)
CREATE POLICY "Allow anonymous users to insert voice notes"
  ON voice_notes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to insert form submissions"
  ON form_submissions FOR INSERT
  TO anon
  WITH CHECK (true);
