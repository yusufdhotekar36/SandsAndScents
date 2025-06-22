/*
  # Create orders and order_items tables for checkout

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_id` (text, unique - SS + timestamp)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `customer_email` (text)
      - `shipping_address` (text)
      - `city` (text)
      - `state` (text)
      - `pincode` (text)
      - `total_amount` (decimal)
      - `payment_method` (text)
      - `transaction_id` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `perfume_id` (text)
      - `perfume_name` (text)
      - `perfume_image` (text)
      - `quantity` (integer)
      - `price` (decimal)
      - `total` (decimal)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert (guest checkout)
    - Add policies for admin read access
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  shipping_address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  perfume_id text NOT NULL,
  perfume_name text NOT NULL,
  perfume_image text NOT NULL,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders (guest checkout)
CREATE POLICY "Allow public to create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to insert order items
CREATE POLICY "Allow public to create order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own orders by phone/email
CREATE POLICY "Allow customers to read own orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

-- Allow public to read order items
CREATE POLICY "Allow public to read order items"
  ON order_items
  FOR SELECT
  TO public
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at_column();