
-- Create a storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB
  '{image/png,image/jpeg,application/pdf}'
)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the documents bucket
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    (bucket_id = 'documents') AND
    (auth.uid() = CAST(SUBSTRING(name FROM '^([^/]+)') AS uuid))
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects
  FOR SELECT
  USING (
    (bucket_id = 'documents') AND
    (auth.uid() = CAST(SUBSTRING(name FROM '^([^/]+)') AS uuid))
  );

CREATE POLICY "Users can update their own documents"
  ON storage.objects
  FOR UPDATE
  USING (
    (bucket_id = 'documents') AND
    (auth.uid() = CAST(SUBSTRING(name FROM '^([^/]+)') AS uuid))
  );

CREATE POLICY "Users can delete their own documents"
  ON storage.objects
  FOR DELETE
  USING (
    (bucket_id = 'documents') AND
    (auth.uid() = CAST(SUBSTRING(name FROM '^([^/]+)') AS uuid))
  );
