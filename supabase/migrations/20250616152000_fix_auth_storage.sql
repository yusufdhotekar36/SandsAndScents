/*
  # Fix authentication storage issue

  The user information is being stored in the public.users table but not properly
  in the auth.users table. This migration fixes the authentication flow.
*/

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a function that only handles the public.users table insertion
-- Let Supabase handle the auth.users table automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name text;
  user_phone text;
BEGIN
  -- Extract user metadata with better error handling
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  
  -- Log the values for debugging
  RAISE NOTICE 'Creating user profile for: %', NEW.email;
  RAISE NOTICE 'Full name: %, Phone: %', user_full_name, user_phone;
  
  -- Only insert into public.users table
  -- Don't try to modify auth.users table as it's managed by Supabase
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_phone,
    'user'
  );
  
  RAISE NOTICE 'User profile created successfully for: %', NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors that occur
    RAISE NOTICE 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to manually confirm existing users' emails
CREATE OR REPLACE FUNCTION public.confirm_user_emails()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Update auth.users to confirm emails for users who don't have email_confirmed_at set
  FOR user_record IN 
    SELECT id, email
    FROM auth.users
    WHERE email_confirmed_at IS NULL
  LOOP
    UPDATE auth.users 
    SET email_confirmed_at = now()
    WHERE id = user_record.id;
    
    RAISE NOTICE 'Confirmed email for user: %', user_record.email;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to sync missing user profiles
CREATE OR REPLACE FUNCTION public.sync_missing_user_profiles()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Create user profiles for auth.users that don't have corresponding public.users entries
  FOR user_record IN 
    SELECT 
      au.id,
      au.email,
      COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
      COALESCE(au.raw_user_meta_data->>'phone', '') as phone
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
  LOOP
    INSERT INTO public.users (id, email, full_name, phone, role)
    VALUES (
      user_record.id,
      user_record.email,
      user_record.full_name,
      user_record.phone,
      'user'
    );
    
    RAISE NOTICE 'Created missing profile for user: %', user_record.email;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 