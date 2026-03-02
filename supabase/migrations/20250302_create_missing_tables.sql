-- Payments tabel voor Stripe betalingen
CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric DEFAULT 0,
  currency text DEFAULT 'eur',
  status text DEFAULT 'pending',
  stripe_payment_id text,
  plan text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON payments 
  FOR ALL USING (true);

-- Categorization rules tabel
CREATE TABLE IF NOT EXISTS categorization_rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword text,
  category text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE categorization_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON categorization_rules 
  FOR ALL USING (true);
