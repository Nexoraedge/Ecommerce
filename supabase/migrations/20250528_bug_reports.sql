-- Create a function to create another function if it doesn't exist
CREATE OR REPLACE FUNCTION create_function_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if our helper function exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'create_bug_reports_table'
  ) THEN
    -- Create the function to create the bug_reports table
    CREATE OR REPLACE FUNCTION create_bug_reports_table()
    RETURNS void AS $func$
    BEGIN
      -- Create the bug_reports table if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'bug_reports'
      ) THEN
        CREATE TABLE public.bug_reports (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          files JSONB,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );

        -- Add RLS policies
        ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

        -- Policy for users to view their own bug reports
        CREATE POLICY "Users can view their own bug reports"
          ON public.bug_reports
          FOR SELECT
          USING (auth.uid() = user_id);

        -- Policy for users to insert their own bug reports
        CREATE POLICY "Users can insert their own bug reports"
          ON public.bug_reports
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        -- Policy for users to update their own bug reports
        CREATE POLICY "Users can update their own bug reports"
          ON public.bug_reports
          FOR UPDATE
          USING (auth.uid() = user_id);

        -- Create updated_at trigger
        CREATE TRIGGER set_updated_at
          BEFORE UPDATE ON public.bug_reports
          FOR EACH ROW
          EXECUTE FUNCTION set_updated_at_timestamp();
      END IF;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function for updated_at if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'set_updated_at_timestamp'
  ) THEN
    CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = TIMEZONE('utc', NOW());
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Execute the function to create the bug_reports table
SELECT create_function_if_not_exists();
