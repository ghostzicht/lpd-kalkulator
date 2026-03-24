# Supabase Fixes Benötigt

## Problem
Die `quotes` Tabelle existiert, aber:
1. ❌ Die `total` Spalte fehlt
2. ❌ RLS (Row Level Security) blockiert INSERT operations

## Lösung
Gehe zu: https://rfgjylqyeaxrzlxqdvbb.supabase.co

### 1. SQL Editor → Neue Query ausführen:

```sql
-- Add missing total column
ALTER TABLE quotes ADD COLUMN total DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Fix RLS policies (remove restrictive policy, add permissive one)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON quotes;

-- Create simple policy that allows all operations (for testing)
CREATE POLICY "Allow all operations" ON quotes FOR ALL USING (true);

-- Or if you want it more secure (only for authenticated users):
-- CREATE POLICY "Allow all for authenticated" ON quotes 
--   FOR ALL USING (auth.role() = 'authenticated');
```

### 2. Teste danach mit:
```bash
cd ~/Developer/lpd-kalkulator
node test_quotes.js
```

## Alternative: Neue Tabelle erstellen
Falls das nicht funktioniert, komplette Neu-Erstellung:

```sql
-- Drop and recreate
DROP TABLE IF EXISTS quotes CASCADE;

CREATE TABLE quotes (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT,
  quote_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but with permissive policy
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON quotes FOR ALL USING (true);

-- Create indexes
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);
```