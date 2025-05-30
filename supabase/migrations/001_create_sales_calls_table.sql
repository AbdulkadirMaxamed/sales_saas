-- Create sales_calls table
CREATE TABLE IF NOT EXISTS public.sales_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  customer TEXT NOT NULL,
  duration TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'neutral',
  ai_processing_progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS sales_calls_user_id_idx ON public.sales_calls(user_id);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS sales_calls_date_idx ON public.sales_calls(date DESC);

-- Note: RLS is disabled for this setup since we use Clerk for authentication
-- All authorization is handled in server actions by filtering with Clerk user_id

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_sales_calls_updated_at ON public.sales_calls;
CREATE TRIGGER update_sales_calls_updated_at 
  BEFORE UPDATE ON public.sales_calls 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

