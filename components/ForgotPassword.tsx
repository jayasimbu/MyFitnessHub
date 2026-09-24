
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Mail, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ForgotPasswordProps {
    onNavigate: (page: string) => void;
}

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // The redirectTo should match your app's base URL. 
      // Supabase handles the session injection via the URL fragment automatically.
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin, 
      });

      if (error) throw error;

      setStatus('success');
      setMessage('A reset link has been dispatched to your inbox.');
    } catch (err: any) {
      console.error('Reset error:', err);
      setStatus('error');
      setMessage(err.message || 'The request could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background Energy Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <MotionDiv 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl relative z-10"
      >
        <button 
            onClick={() => onNavigate('login')}
            className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors p-2"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-10 mt-6">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-inner">
                    <KeyRound className="w-8 h-8 text-lime-400" />
                </div>
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-3">Recovery Center</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">Forgot your access key? No problem. Enter your email and we'll send a secure reset link.</p>
        </div>

        {status === 'success' ? (
             <MotionDiv 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-lime-500/10 border border-lime-500/30 p-8 rounded-2xl text-center"
             >
                <div className="w-12 h-12 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-lime-500" />
                </div>
                <h3 className="text-white font-bold mb-2">Uplink Sent!</h3>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                    Check <span className="text-white font-bold">{email}</span>. Click the link in the message to reset your password.
                </p>
                <button 
                    onClick={() => onNavigate('login')}
                    className="w-full bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-700 transition-colors"
                >
                    Back to Terminal
                </button>
             </MotionDiv>
        ) : (
            <>
                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-pulse">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> 
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Registered Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 p-4 text-white focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all placeholder:text-zinc-700"
                                placeholder="commander@myfitnesshub.fit"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-lime-500 text-black font-bold uppercase py-4 rounded-xl hover:bg-lime-400 transition-all duration-300 shadow-[0_0_20px_rgba(132,204,22,0.2)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Request Access Link</span>
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </>
        )}
      </MotionDiv>
    </div>
  );
};

export default ForgotPassword;
