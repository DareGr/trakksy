-- Add missing favicon_url column to subscriptions table
-- Run this in your Supabase SQL Editor

-- Add favicon_url column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='subscriptions' AND column_name='favicon_url') THEN
        ALTER TABLE subscriptions ADD COLUMN favicon_url TEXT;
    END IF;
END $$;

-- Also add service_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='subscriptions' AND column_name='service_id') THEN
        ALTER TABLE subscriptions ADD COLUMN service_id UUID;
    END IF;
END $$;

-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  favicon_url TEXT,
  category TEXT,
  suggested_price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_subscriptions_service_id'
    ) THEN
        ALTER TABLE subscriptions 
        ADD CONSTRAINT fk_subscriptions_service_id 
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS for services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for services table (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view services" ON services;
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
CREATE POLICY "Authenticated users can insert services" ON services 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_service_id ON subscriptions(service_id);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);

-- Insert predefined services (only if they don't exist)
INSERT INTO services (name, favicon_url, category, suggested_price) 
VALUES 
('Netflix', 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico', 'Entertainment', 15.99),
('Spotify', 'https://open.spotify.com/favicon.ico', 'Music', 9.99),
('YouTube Premium', 'https://www.youtube.com/favicon.ico', 'Entertainment', 11.99),
('ChatGPT Plus', 'https://chat.openai.com/favicon.ico', 'Productivity', 20.00),
('Disney+', 'https://www.disneyplus.com/favicon.ico', 'Entertainment', 7.99),
('Amazon Prime', 'https://www.amazon.com/favicon.ico', 'Shopping', 14.99),
('Hulu', 'https://www.hulu.com/favicon.ico', 'Entertainment', 7.99),
('Apple Music', 'https://music.apple.com/favicon.ico', 'Music', 9.99),
('Adobe Creative Cloud', 'https://www.adobe.com/favicon.ico', 'Productivity', 52.99),
('Microsoft 365', 'https://www.microsoft.com/favicon.ico', 'Productivity', 6.99),
('Dropbox', 'https://www.dropbox.com/favicon.ico', 'Productivity', 9.99),
('HBO Max', 'https://www.hbomax.com/favicon.ico', 'Entertainment', 14.99),
('Canva Pro', 'https://www.canva.com/favicon.ico', 'Productivity', 12.99),
('GitHub Pro', 'https://github.com/favicon.ico', 'Productivity', 4.00),
('Figma', 'https://www.figma.com/favicon.ico', 'Productivity', 12.00)
ON CONFLICT (name) DO NOTHING; 