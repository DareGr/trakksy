# Database Setup Guide

## Problem
The error "Could not find a relationship between 'subscriptions' and 'services'" occurs when Supabase hasn't properly recognized the foreign key relationship between tables.

## Solution

### Step 1: Run the Schema Update
Go to your Supabase project → SQL Editor and run the SQL from `supabase-schema-update.sql` **step by step**:

1. First, create the services table:
```sql
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  favicon_url TEXT,
  category TEXT,
  suggested_price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Add the service_id column to subscriptions:
```sql
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS service_id UUID;
```

3. Create the foreign key constraint:
```sql
ALTER TABLE subscriptions 
ADD CONSTRAINT fk_subscriptions_service_id 
FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
```

4. Enable RLS and create policies:
```sql
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert services" ON services 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

5. Create indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_subscriptions_service_id ON subscriptions(service_id);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
```

6. Insert the predefined services (run the INSERT statement from the schema file).

### Step 2: Refresh Schema Cache
After running the SQL, you may need to refresh your browser or wait a few minutes for Supabase to recognize the relationship.

### Step 3: Test the Application
The application now handles the relationship gracefully:
- **Custom services**: Use the `favicon_url` field in subscriptions table
- **Database services**: Reference via `service_id` foreign key
- **Fallback**: If the relationship isn't recognized yet, services are fetched separately and matched in memory

## Features Now Available

1. **Service Selection**: Choose from predefined popular services or add custom ones
2. **Favicon Support**: Automatic icons for popular services
3. **Suggested Pricing**: Pre-filled amounts for known services
4. **Categories**: Organized service types
5. **Backward Compatibility**: Existing subscriptions continue to work

## Troubleshooting

If you still get the relationship error:
1. Check that the foreign key constraint was created successfully
2. Verify the services table exists and has data
3. Try refreshing your browser
4. The app will work in "fallback mode" until the relationship is recognized