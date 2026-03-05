'use client';

import { useState, useEffect } from 'react';
import { Star, Send, X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversionId?: string;
  userEmail?: string;
}

export function FeedbackModal({ isOpen, onClose, conversionId, userEmail }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Prevent closing without submitting
  useEffect(() => {
    if (isOpen && !submitted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback,
          anonymous,
          conversion_id: conversionId,
          user_email: anonymous ? null : userEmail,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl max-w-md w-full p-6 shadow-2xl">
        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Hoe was je ervaring?</h2>
              <p className="text-slate-400 text-sm">
                Je feedback helpt ons BSCPro te verbeteren.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Stars */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback Text */}
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-300">
                  Wat kan beter? (optioneel)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Vertel ons wat je van de conversie vond..."
                  className="w-full min-h-[100px] p-3 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00b8d9] placeholder-slate-500"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#00b8d9]"
                />
                <label htmlFor="anonymous" className="text-sm text-slate-400">
                  Anoniem delen als referentie?
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="w-full bg-[#00b8d9] text-black font-semibold py-3 rounded-lg hover:bg-[#00a8c9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? 'Versturen...' : 'Verstuur feedback'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bedankt voor je feedback!</h3>
            <p className="text-slate-400 text-sm">
              Je helpt ons om BSCPro beter te maken.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-[#161b22] text-white rounded-lg hover:bg-[#1f242c] transition-colors"
            >
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
