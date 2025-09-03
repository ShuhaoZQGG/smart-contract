-- Create template_shares table for collaboration features
CREATE TABLE IF NOT EXISTS public.template_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT ARRAY['view', 'generate'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(template_id, shared_with_user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_shares_template_id ON public.template_shares(template_id);
CREATE INDEX IF NOT EXISTS idx_template_shares_shared_with ON public.template_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_template_shares_created_by ON public.template_shares(created_by);

-- Enable RLS
ALTER TABLE public.template_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for template_shares
CREATE POLICY "Users can view shares they created or are shared with" ON public.template_shares
    FOR SELECT
    USING (
        auth.uid() = created_by OR 
        auth.uid() = shared_with_user_id OR
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = template_shares.template_id 
            AND templates.user_id = auth.uid()
        )
    );

CREATE POLICY "Template owners can create shares" ON public.template_shares
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = template_id 
            AND templates.user_id = auth.uid()
        )
    );

CREATE POLICY "Template owners can delete shares" ON public.template_shares
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = template_shares.template_id 
            AND templates.user_id = auth.uid()
        )
    );

-- Add bulk_generations table for tracking bulk generation jobs
CREATE TABLE IF NOT EXISTS public.bulk_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    csv_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create index for bulk_generations
CREATE INDEX IF NOT EXISTS idx_bulk_generations_user_id ON public.bulk_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_generations_template_id ON public.bulk_generations(template_id);
CREATE INDEX IF NOT EXISTS idx_bulk_generations_status ON public.bulk_generations(status);

-- Enable RLS for bulk_generations
ALTER TABLE public.bulk_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bulk_generations
CREATE POLICY "Users can view their own bulk generations" ON public.bulk_generations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bulk generations" ON public.bulk_generations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bulk generations" ON public.bulk_generations
    FOR UPDATE
    USING (auth.uid() = user_id);