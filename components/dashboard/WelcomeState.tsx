import { motion } from 'framer-motion';
import { Upload, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStateProps {
  onUploadClick: () => void;
}

export function WelcomeState({ onUploadClick }: WelcomeStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {/* Animated Icon */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center"
        >
          <FileText className="w-12 h-12 text-teal-400" />
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-teal-500/30 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-teal-300" />
        </motion.div>
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Welcome to <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">BSC Pro</span>
      </h2>

      {/* Description */}
      <p className="text-lg text-slate-400 mb-8 max-w-md">
        Transform your bank statements into organized Excel/CSV data in seconds. 
        Fast, secure, and powered by AI.
      </p>

      {/* Feature List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl">
        {[
          { icon: Upload, text: 'Upload PDF' },
          { icon: Sparkles, text: 'AI Processing' },
          { icon: FileText, text: 'Get Excel/CSV' }
        ].map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-sm text-slate-300">{item.text}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          size="lg"
          onClick={onUploadClick}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white px-8 py-6 text-lg group"
        >
          Upload Your First Statement
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Trust Badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-sm text-slate-500"
      >
        Supports all major Dutch banks • GDPR Compliant • 99.5% Accuracy
      </motion.p>
    </motion.div>
  );
}
