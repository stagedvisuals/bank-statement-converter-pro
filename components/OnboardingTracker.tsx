import { useState, useEffect } from 'react';
import { Check, Gift, ChevronRight, User, Upload, Download, Calculator, Settings } from 'lucide-react';

interface OnboardingStatus {
  progress_percentage: number;
  step_profile_completed: boolean;
  step_first_upload_completed: boolean;
  step_first_export_completed: boolean;
  step_tools_used_completed: boolean;
  step_settings_completed: boolean;
  reward_claimed: boolean;
}

export default function OnboardingTracker() {
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const session = localStorage.getItem('bscpro_session');
      if (!session) return;

      const { access_token } = JSON.parse(session);
      const response = await fetch('/api/user/credits', {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setOnboarding(data.onboarding);
      }
    } catch (error) {
      console.error('Error fetching onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeStep = async (step: string) => {
    try {
      const session = localStorage.getItem('bscpro_session');
      if (!session) return;

      const { access_token } = JSON.parse(session);
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ step })
      });

      if (response.ok) {
        const data = await response.json();
        setOnboarding(data.onboarding);
      }
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  if (loading || !onboarding || onboarding.progress_percentage === 100) {
    return null;
  }

  const steps = [
    { id: 'profile', label: 'Profiel completeren', icon: User, completed: onboarding.step_profile_completed },
    { id: 'first_upload', label: 'Eerste factuur uploaden', icon: Upload, completed: onboarding.step_first_upload_completed },
    { id: 'first_export', label: 'Export downloaden', icon: Download, completed: onboarding.step_first_export_completed },
    { id: 'tools_used', label: 'Tool gebruiken', icon: Calculator, completed: onboarding.step_tools_used_completed },
    { id: 'settings', label: 'Instellingen bekijken', icon: Settings, completed: onboarding.step_settings_completed },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Getting Started</h3>
        <span className="text-sm text-[#00b8d9] font-bold">{onboarding.progress_percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-[#00b8d9] to-blue-500 transition-all duration-500"
          style={{ width: `${onboarding.progress_percentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
              step.completed 
                ? 'bg-green-500/10 text-green-600' 
                : 'hover:bg-secondary cursor-pointer'
            }`}
            onClick={() => !step.completed && completeStep(step.id)}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step.completed ? 'bg-green-500 text-white' : 'bg-secondary text-muted-foreground'
            }`}>
              {step.completed ? <Check className="w-4 h-4" /> : <step.icon className="w-3 h-3" />}
            </div>
            <span className={`text-sm flex-1 ${step.completed ? 'line-through opacity-60' : ''}`}>
              {step.label}
            </span>
            {!step.completed && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Reward Preview */}
      {onboarding.progress_percentage < 100 && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              <strong>+2 credits</strong> bij 100%!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
