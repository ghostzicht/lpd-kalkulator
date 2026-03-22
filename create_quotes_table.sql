-- Create quotes table for LPD Kalkulator
-- Run this in Supabase SQL Editor if the quotes table doesn't exist

CREATE TABLE quotes (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id),
  quote_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (all operations allowed)
CREATE POLICY "Allow all operations for authenticated users" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quotes_updated_at 
  BEFORE UPDATE ON quotes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Sample quote structure (for reference):
-- {
--   "product_id": 123,
--   "product_name": "Stanley Stella Creator T-Shirt",
--   "quantity": 25,
--   "unit_price": 12.50,
--   "print_method": "dtg",
--   "print_sides": 1,
--   "discount_percent": 25
-- }