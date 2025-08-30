/*
  # Add num_of_order column to orders table
  
  This migration adds a num_of_order column that:
  - Starts from 1
  - Auto-increments for each new order
  - Provides a simple sequential order number for customers
*/

-- Add the num_of_order column
ALTER TABLE orders 
ADD COLUMN num_of_order SERIAL;

-- Create a sequence starting from 1 (SERIAL already does this, but being explicit)
-- The SERIAL type automatically creates a sequence and sets it as the default value

-- Add a comment to document the column
COMMENT ON COLUMN orders.num_of_order IS 'Sequential order number starting from 1';

-- Update any existing orders to have sequential numbers
-- This is optional but ensures existing orders have proper numbering
DO $$
DECLARE
    order_record RECORD;
    counter INTEGER := 1;
BEGIN
    FOR order_record IN 
        SELECT id FROM orders ORDER BY created_at ASC
    LOOP
        UPDATE orders 
        SET num_of_order = counter 
        WHERE id = order_record.id;
        counter := counter + 1;
    END LOOP;
END $$; 