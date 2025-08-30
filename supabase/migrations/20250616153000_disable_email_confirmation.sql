/*
  # Disable email confirmation completely

  This migration ensures that users can sign up and log in immediately
  without any email confirmation requirements.
*/

-- Disable email confirmation for all existing users
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;

-- Update the trigger function to ensure immediate authentication
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
  
  -- Insert user profile into public.users table
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_phone,
    'user'
  );
  
  -- Ensure email is confirmed immediately (bypass any email confirmation)
  UPDATE auth.users 
  SET email_confirmed_at = now()
  WHERE id = NEW.id;
  
  RAISE NOTICE 'User profile created and email confirmed for: %', NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors that occur
    RAISE NOTICE 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to fix any users who might still have unconfirmed emails
CREATE OR REPLACE FUNCTION public.fix_unconfirmed_users()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Confirm emails for any users who don't have email_confirmed_at set
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

-- Run the fix function immediately
SELECT public.fix_unconfirmed_users(); 