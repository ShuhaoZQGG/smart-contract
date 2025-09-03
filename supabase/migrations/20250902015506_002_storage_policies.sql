-- Storage policies for templates bucket
CREATE POLICY "Users can upload templates" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'templates' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own templates" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'templates' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own templates" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'templates' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own templates" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'templates' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for generated documents bucket
CREATE POLICY "Users can upload generated documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'generated' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own generated documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'generated' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own generated documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'generated' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );