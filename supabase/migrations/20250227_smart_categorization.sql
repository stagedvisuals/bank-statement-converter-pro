-- Smart Categorization Engine
-- Tabel voor gebruikers-specifieke categorisatie regels

CREATE TABLE IF NOT EXISTS categorization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  grootboek_code VARCHAR(50) NOT NULL,
  btw_percentage VARCHAR(10) NOT NULL CHECK (btw_percentage IN ('21', '9', '0')),
  category_name VARCHAR(255), -- optioneel: "Vervoer", "Software", etc.
  is_active BOOLEAN DEFAULT TRUE,
  match_type VARCHAR(20) DEFAULT 'contains' CHECK (match_type IN ('contains', 'starts_with', 'ends_with', 'exact')),
  priority INTEGER DEFAULT 100, -- hoger nummer = hogere prioriteit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexen voor snelle lookups
CREATE INDEX IF NOT EXISTS idx_categorization_rules_user_id ON categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_keyword ON categorization_rules(keyword);
CREATE INDEX IF NOT EXISTS idx_categorization_rules_active ON categorization_rules(is_active) WHERE is_active = TRUE;

-- Tabel voor automatisch geclassificeerde transacties (audit trail)
CREATE TABLE IF NOT EXISTS transaction_classifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES user_transactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES categorization_rules(id) ON DELETE SET NULL,
  -- Gekozen categorisatie
  grootboek_code VARCHAR(50),
  btw_percentage VARCHAR(10),
  category_name VARCHAR(255),
  -- Metadata
  classification_method VARCHAR(50) NOT NULL CHECK (classification_method IN ('rule_match', 'llm_predicted', 'manual', 'none')),
  confidence_score DECIMAL(3,2), -- 0.00 - 1.00
  matched_keyword VARCHAR(255), -- welk keyword matched
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaction_classifications_transaction ON transaction_classifications(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_classifications_user ON transaction_classifications(user_id);

-- RLS policies
ALTER TABLE categorization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_classifications ENABLE ROW LEVEL SECURITY;

-- Gebruikers kunnen alleen hun eigen regels zien/beheren
CREATE POLICY "Users can manage own categorization rules" ON categorization_rules
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own classifications" ON transaction_classifications
  FOR SELECT USING (user_id = auth.uid());

-- Trigger om updated_at bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_categorization_rules_updated_at ON categorization_rules;
CREATE TRIGGER update_categorization_rules_updated_at
  BEFORE UPDATE ON categorization_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Default regels voor nieuwe gebruikers (optioneel, kan later uitgebreid worden)
-- Deze worden gekopieerd naar de user bij registratie
CREATE TABLE IF NOT EXISTS default_categorization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  grootboek_code VARCHAR(50) NOT NULL,
  btw_percentage VARCHAR(10) NOT NULL,
  category_name VARCHAR(255),
  match_type VARCHAR(20) DEFAULT 'contains',
  priority INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE
);

-- Voorbeeld default regels (Nederlandse standaarden)
INSERT INTO default_categorization_rules (keyword, grootboek_code, btw_percentage, category_name, priority) VALUES
  ('NS ', '4200', '9', 'Vervoer', 100),
  ('OV-chipkaart', '4200', '9', 'Vervoer', 100),
  ('Uber', '4200', '9', 'Vervoer', 100),
  ('Bolt', '4200', '9', 'Vervoer', 100),
  ('Shell', '4250', '21', 'Brandstof', 100),
  ('BP ', '4250', '21', 'Brandstof', 100),
  ('Total', '4250', '21', 'Brandstof', 100),
  ('Tango', '4250', '21', 'Brandstof', 100),
  ('Adobe', '4300', '21', 'Software', 100),
  ('Microsoft', '4300', '21', 'Software', 100),
  ('Google', '4300', '21', 'Software', 100),
  ('Slack', '4300', '21', 'Software', 100),
  ('Notion', '4300', '21', 'Software', 100),
  ('Figma', '4300', '21', 'Software', 100),
  ('KPN', '4400', '21', 'Telecommunicatie', 100),
  ('Vodafone', '4400', '21', 'Telecommunicatie', 100),
  ('T-Mobile', '4400', '21', 'Telecommunicatie', 100),
  ('Ziggo', '4400', '21', 'Telecommunicatie', 100),
  ('Albert Heijn', '4500', '9', 'Kantoorbenodigdheden', 100),
  ('Jumbo', '4500', '9', 'Kantoorbenodigdheden', 100),
  ('Hema', '4500', '9', 'Kantoorbenodigdheden', 100),
  ('BOL.COM', '4500', '9', 'Kantoorbenodigdheden', 100),
  ('Coolblue', '4500', '9', 'Kantoorbenodigdheden', 100),
  ('IKEA', '4600', '21', 'Inventaris', 100),
  ('Booking.com', '4700', '0', 'Verblijfskosten', 100), -- 0% BTW voor buitenlandse hotels
  ('Airbnb', '4700', '0', 'Verblijfskosten', 100),
  ('Fletcher', '4700', '9', 'Verblijfskosten', 100),
  ('Van der Valk', '4700', '9', 'Verblijfskosten', 100),
  ('Belastingdienst', '4800', '0', 'Belastingen', 200), -- Prioriteit 200 = hoger
  ('KVK', '4850', '0', 'Vergunningen', 100),
  ('LinkedIn', '4900', '21', 'Marketing', 100),
  ('Meta', '4900', '21', 'Marketing', 100),
  ('Facebook', '4900', '21', 'Marketing', 100),
  ('Instagram', '4900', '21', 'Marketing', 100),
  ('HIREBEE', '4950', '21', 'Administratie', 100),
  ('AFAS', '4950', '21', 'Administratie', 100),
  ('Exact', '4950', '21', 'Administratie', 100),
  ('SnelStart', '4950', '21', 'Administratie', 100),
  ('Moneybird', '4950', '21', 'Administratie', 100)
ON CONFLICT DO NOTHING;
