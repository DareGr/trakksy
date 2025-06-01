-- SubTrack Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Create services table for predefined services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  favicon_url TEXT,
  category TEXT,
  suggested_price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  next_billing_date DATE NOT NULL,
  tag TEXT,
  notes TEXT,
  favicon_url TEXT, -- For custom services not in services table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Services table policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (true);

-- Only allow service creation by authenticated users (you can restrict this further if needed)
CREATE POLICY "Authenticated users can insert services" ON services
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_service_id ON subscriptions(service_id);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_created_at ON subscriptions(created_at);
CREATE INDEX idx_services_name ON services(name);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert predefined services
INSERT INTO services (name, favicon_url, category, suggested_price) VALUES
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
('Figma', 'https://www.figma.com/favicon.ico', 'Productivity', 12.00);

-- Optional: Insert some sample data (remove user_id or replace with actual user ID)
-- INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_billing_date, tag, notes, favicon_url) VALUES
-- ('your-user-id-here', 'Netflix', 15.99, 'monthly', '2024-02-15', 'Entertainment', 'Standard plan', 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico'),
-- ('your-user-id-here', 'Spotify', 9.99, 'monthly', '2024-02-10', 'Music', 'Premium subscription', 'https://open.spotify.com/favicon.ico'),
-- ('your-user-id-here', 'Adobe Creative Cloud', 239.88, 'yearly', '2024-12-01', 'Productivity', 'All apps plan', 'https://www.adobe.com/favicon.ico'); 