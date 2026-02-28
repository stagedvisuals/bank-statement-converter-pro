-- Fix 1: Update de timestamp trigger functie
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.bijgewerkt_op = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
