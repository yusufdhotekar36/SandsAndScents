/*
  # Create categories table for perfume categorization

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Initial Data
    - Insert default categories
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Categories are publicly readable"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to read categories
CREATE POLICY "Authenticated users can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Oud', 'Rich and woody Arabian fragrance'),
  ('Rose', 'Floral and romantic scents'),
  ('Musk', 'Warm and sensual fragrances'),
  ('Amber', 'Sweet and resinous scents'),
  ('Sandalwood', 'Creamy and smooth woody notes')
ON CONFLICT (name) DO NOTHING;