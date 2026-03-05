// Types for user profile and onboarding

export type Beroep = 'boekhouder' | 'zzp' | 'mkb' | 'adviseur' | 'anders';

export interface UserProfile {
  id: string;
  user_id: string;
  bedrijfsnaam: string;
  kvk_nummer?: string;
  btw_nummer?: string;
  beroep: Beroep;
  afschriften_per_maand?: number;
  logo_url?: string;
  
  // Instellingen
  instelling_btw_categorisering: boolean;
  instelling_bedrijfsnaam_in_excel: boolean;
  instelling_lopend_saldo: boolean;
  instelling_logo_in_excel: boolean;
  instelling_kostenplaats: boolean;
  
  // Status
  onboarding_voltooid: boolean;
  
  // Metadata
  aangemaakt_op: string;
  bijgewerkt_op: string;
}

export interface OnboardingData {
  beroep: Beroep | null;
  bedrijfsnaam: string;
  kvk_nummer: string;
  btw_nummer: string;
  afschriften_per_maand: number | null;
}

export const BEROEP_OPTIES: { value: Beroep; label: string; emoji: string; description: string }[] = [
  { 
    value: 'boekhouder', 
    label: 'Boekhouder', 
    emoji: '📊',
    description: 'Ik verwerk afschriften voor klanten'
  },
  { 
    value: 'zzp', 
    label: 'ZZP\'er', 
    emoji: '💼',
    description: 'Ik werk voor mezelf'
  },
  { 
    value: 'mkb', 
    label: 'MKB', 
    emoji: '🏢',
    description: 'Ik run een klein of middelgroot bedrijf'
  },
  { 
    value: 'adviseur', 
    label: 'Adviseur', 
    emoji: '📈',
    description: 'Ik geef financieel advies'
  },
  { 
    value: 'anders', 
    label: 'Anders', 
    emoji: '✨',
    description: 'Iets anders'
  },
];

export const AFSCHRIFTEN_OPTIES = [
  { value: 5, label: '< 10 per maand' },
  { value: 30, label: '10 - 50 per maand' },
  { value: 75, label: '50 - 100 per maand' },
  { value: 150, label: '100+ per maand' },
];
