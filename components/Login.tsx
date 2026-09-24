
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, ArrowLeft, Loader2, AlertCircle, 
  Eye, EyeOff, ShieldCheck, Mail, Lock, 
  KeyRound, ChevronRight, Zap 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
    onNavigate: (page: string) => void;
}

const MotionDiv = motion.div as any;

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [uiState, setUiState] = useState({
    showPassword: false,
    loading: false,
    globalError: ''
  });

  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});

  const validate = () => {
    const errors: {email?: string, password?: string} = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Security code is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (uiState.globalError) setUiState(prev => ({ ...prev, globalError: '' }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUiState(prev => ({ ...prev, loading: true, globalError: '' }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(), 
        password: formData.password,
      });

      if (error) throw error;
      
      const user = data.user;
      const isAdmin = user?.user_metadata?.is_admin === true || 
                      user?.app_metadata?.role === 'admin' ||
                      formData.email.toLowerCase().includes('admin@myfitnesshub.fit');

      if (isAdmin) {
          onNavigate('admin-dashboard');
      } else {
          onNavigate('dashboard');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      let errMsg = 'Access denied. Double check credentials.';
      if (err.message.includes('Email not confirmed')) {
         errMsg = 'Email verification required. Check your inbox.';
      }
      setUiState(prev => ({ ...prev, globalError: errMsg }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-16 relative overflow-hidden">
      {/* Energy Background Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse delay-700"></div>

      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative z-10"
      >
        {/* Navigation Control */}
        <button 
          onClick={() => onNavigate('home')} 
          className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-all p-2.5 rounded-full hover:bg-zinc-800 group"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Branding Header */}
        <div className="text-center mb-10 mt-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-500/10 to-zinc-800 rounded-2xl flex items-center justify-center border border-lime-500/20 shadow-inner group">
              <Dumbbell className="w-8 h-8 text-lime-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-2 uppercase tracking-tighter">
            Access <span className="text-lime-400">Hub</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Authorization Required</p>
          <div className="h-1 w-16 bg-lime-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Feedback */}
        {uiState.globalError && (
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-4 text-red-400 text-xs leading-relaxed animate-pulse shadow-lg shadow-red-500/5"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> 
            <span className="font-bold uppercase tracking-wide">{uiState.globalError}</span>
          </MotionDiv>
        )}

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Session Identity</label>
            <div className="relative group">
              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-zinc-700 group-focus-within:text-lime-500'}`} />
              <input 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 pl-14 text-white focus:outline-none transition-all text-sm md:text-base ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-lime-500 shadow-inner'}`}
                placeholder="commander@domain.fit"
              />
            </div>
            {fieldErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 animate-pulse">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Security Key</label>
            <div className="relative group">
              <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldErrors.password ? 'text-red-500' : 'text-zinc-700 group-focus-within:text-lime-500'}`} />
              <input 
                name="password"
                type={uiState.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 pl-14 pr-14 text-white focus:outline-none transition-all text-sm md:text-base ${fieldErrors.password ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-lime-500 shadow-inner'}`}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors p-1"
                aria-label={uiState.showPassword ? "Hide password" : "Show password"}
              >
                {uiState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 animate-pulse">{fieldErrors.password}</p>}
          </div>

          <div className="flex justify-end pr-2">
            <button 
              type="button" 
              onClick={() => onNavigate('forgot-password')} 
              className="text-[10px] text-zinc-500 hover:text-lime-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
            >
              <KeyRound className="w-3 h-3" /> Credentials Lost?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={uiState.loading} 
            className="w-full bg-lime-500 text-black font-black uppercase py-5 rounded-2xl hover:bg-lime-400 transition-all shadow-[0_20px_40px_rgba(132,204,22,0.2)] flex items-center justify-center gap-3 disabled:opacity-70 tracking-[0.3em] text-sm active:scale-95 group"
          >
            {uiState.loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>AUTHORIZE ACCESS <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-6 py-4 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
            New Cadet? <button onClick={() => onNavigate('signup')} className="text-white hover:text-lime-400 underline decoration-lime-500/30 transition-colors">Register for Signal</button>
          </div>
          
          <div className="pt-8 border-t border-zinc-800">
            <button 
              onClick={() => onNavigate('admin-login')} 
              className="text-[9px] uppercase font-black text-zinc-700 hover:text-red-500 transition-all flex items-center justify-center gap-3 mx-auto tracking-[0.4em] group"
            >
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" /> Master Admin Override
            </button>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Login;
