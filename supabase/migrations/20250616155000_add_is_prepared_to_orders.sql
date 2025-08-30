-- Add is_prepared column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_prepared boolean DEFAULT false;

-- Set all existing orders to not prepared by default
UPDATE orders SET is_prepared = false WHERE is_prepared IS NULL;

-- Add a comment for clarity
COMMENT ON COLUMN orders.is_prepared IS 'True if the order has been prepared (checkbox in admin dashboard)'; 