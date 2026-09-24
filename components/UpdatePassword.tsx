
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface UpdatePasswordProps {
    onNavigate: (page: string) => void;
}

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    return score; // Max 4
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(calculateStrength(val));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 1) {
        setStatus('error');
        setMessage('Password is too weak.');
        return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) throw error;

      setStatus('success');
      setTimeout(() => {
          onNavigate('login');
      }, 3000);

    } catch (err: any) {
      console.error('Update error:', err);
      setStatus('error');
      setMessage(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <MotionDiv 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-900 border border-lime-500 p-8 rounded-2xl text-center max-w-sm w-full"
            >
                <CheckCircle className="w-16 h-16 text-lime-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Password Updated</h2>
                <p className="text-zinc-400 text-sm mb-4">Please log in with your new password.</p>
                <p className="text-xs text-zinc-500">Redirecting to login...</p>
            </MotionDiv>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Set New Password</h2>
            <p className="text-zinc-400 text-sm">Please choose a strong password for your account.</p>
        </div>

        {status === 'error' && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> 
                <span>{message}</span>
            </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
            <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">New Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-600" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={handleChange}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 p-3 text-white focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {/* Password Strength Indicator */}
                <div className="mt-3">
                    <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map((level) => (
                            <div 
                                key={level}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                    password.length > 0 && passwordStrength >= level 
                                        ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-yellow-500' : 'bg-lime-500') 
                                        : 'bg-zinc-800'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">Strength</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            passwordStrength === 0 ? 'text-zinc-600' :
                            passwordStrength <= 2 ? 'text-red-500' : 
                            passwordStrength === 3 ? 'text-yellow-500' : 'text-lime-500'
                        }`}>
                            {password.length === 0 ? 'None' : 
                             passwordStrength <= 2 ? 'Weak' : 
                             passwordStrength === 3 ? 'Medium' : 'Strong'}
                        </span>
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-bold uppercase py-3 rounded-lg hover:bg-lime-400 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
        </form>
      </MotionDiv>
    </div>
  );
};

export default UpdatePassword;
