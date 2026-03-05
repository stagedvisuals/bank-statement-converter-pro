-- Fix: Eerst triggers droppen, dan functie, dan opnieuw aanmaken

-- Stap 1: Drop de triggers eerst
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_categorization_rules_updated_at ON public.categorization_rules;

-- Stap 2: Drop de functie
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Stap 3: Maak de functie opnieuw met juiste kolomnaam
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.bijgewerkt_op = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Stap 4: Maak de triggers opnieuw
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorization_rules_updated_at
    BEFORE UPDATE ON public.categorization_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
