-- ═══════════════════════════════════════════════════════════
-- ZELFLEREND CATEGORISERING SYSTEEM
-- Merchant corrections database voor community categorisering
-- ═══════════════════════════════════════════════════════════

-- Hoofdtabel voor gebruikers correcties
CREATE TABLE IF NOT EXISTS merchant_corrections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword text NOT NULL,
  categorie text NOT NULL,
  subcategorie text DEFAULT '',
  btw text DEFAULT '21%',
  icon text DEFAULT '📋',
  toegevoegd_door uuid REFERENCES auth.users(id),
  goedgekeurd boolean DEFAULT true,
  gebruik_count integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Unieke constraint op lowercase keyword
  CONSTRAINT unique_keyword UNIQUE (LOWER(keyword))
);

-- Indexen voor performance
CREATE INDEX IF NOT EXISTS merchant_corrections_keyword_idx ON merchant_corrections (LOWER(keyword));
CREATE INDEX IF NOT EXISTS merchant_corrections_goedgekeurd_idx ON merchant_corrections (goedgekeurd) WHERE goedgekeurd = true;
CREATE INDEX IF NOT EXISTS merchant_corrections_usage_idx ON merchant_corrections (gebruik_count DESC);

-- RLS Policies
ALTER TABLE merchant_corrections ENABLE ROW LEVEL SECURITY;

-- Iedereen kan lezen
CREATE POLICY "Iedereen kan correcties lezen"
  ON merchant_corrections
  FOR SELECT
  USING (true);

-- Ingelogde gebruikers kunnen toevoegen
CREATE POLICY "Ingelogde gebruikers kunnen correcties toevoegen"
  ON merchant_corrections
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admin kan alles (service role)
CREATE POLICY "Service role full access"
  ON merchant_corrections
  FOR ALL
  TO service_role
  USING (true);

-- Commentaar voor documentatie
COMMENT ON TABLE merchant_corrections IS 'Community-driven merchant categorisering';
