-- Error tracking table for failed conversions
CREATE TABLE IF NOT EXISTS conversion_errors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    bank_name TEXT,
    error_type TEXT NOT NULL,
    error_message TEXT,
    file_format TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_conversion_errors_user ON conversion_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_errors_bank ON conversion_errors(bank_name);
CREATE INDEX IF NOT EXISTS idx_conversion_errors_date ON conversion_errors(created_at);

-- RLS policies
ALTER TABLE conversion_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own errors" 
    ON conversion_errors FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own errors" 
    ON conversion_errors FOR SELECT 
    USING (auth.uid() = user_id);

-- Admin can view all errors
CREATE POLICY "Admin can view all errors" 
    ON conversion_errors FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
