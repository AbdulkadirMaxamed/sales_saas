-- Fix RLS issue for Clerk authentication
-- Execute this in your Supabase SQL editor if you already ran the previous setup

-- Drop the existing RLS policy if it exists
DROP POLICY IF EXISTS "Users can only access their own sales calls" ON public.sales_calls;

-- Disable Row Level Security
ALTER TABLE public.sales_calls DISABLE ROW LEVEL SECURITY;

-- Verify the table is accessible
SELECT COUNT(*) FROM public.sales_calls;
