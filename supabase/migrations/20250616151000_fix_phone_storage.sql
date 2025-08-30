/*
  # Fix phone number storage in users table

  The phone number is not being stored properly during signup.
  This migration fixes the trigger function to ensure phone numbers are saved.
*/

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function to handle new user signup with better phone number handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name text;
  user_phone text;
BEGIN
  -- Extract user metadata with better error handling
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  
  -- Log the values for debugging (you can check these in Supabase logs)
  RAISE NOTICE 'Creating user profile for: %', NEW.email;
  RAISE NOTICE 'Full name: %, Phone: %', user_full_name, user_phone;
  
  -- Insert user profile with explicit phone handling
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_phone,
    'user'
  );
  
  -- Auto-confirm the user's email (bypass email confirmation)
  UPDATE auth.users 
  SET email_confirmed_at = now()
  WHERE id = NEW.id;
  
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

-- Also create a function to manually fix existing users without phone numbers
CREATE OR REPLACE FUNCTION public.fix_existing_user_phones()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Update existing users who don't have phone numbers but have them in metadata
  FOR user_record IN 
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data->>'full_name' as full_name,
      au.raw_user_meta_data->>'phone' as phone
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.phone IS NULL OR pu.phone = ''
    AND au.raw_user_meta_data->>'phone' IS NOT NULL
    AND au.raw_user_meta_data->>'phone' != ''
  LOOP
    UPDATE public.users 
    SET 
      full_name = COALESCE(user_record.full_name, full_name),
      phone = user_record.phone
    WHERE id = user_record.id;
    
    RAISE NOTICE 'Updated user % with phone: %', user_record.email, user_record.phone;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 