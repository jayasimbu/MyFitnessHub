
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, ArrowLeft, Loader2, AlertCircle, 
  Mail, Eye, EyeOff, ShieldCheck, LogIn, 
  Shield, Zap, Lock, User, CheckCircle2 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface SignupProps {
    onNavigate: (page: string) => void;
}

const MotionDiv = motion.div as any;

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  // Centralized form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [uiState, setUiState] = useState({
    showPassword: false,
    loading: false,
    globalError: '',
    isAlreadyRegistered: false,
    successState: 'none' as 'none' | 'confirmation_required' | 'complete'
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Memoized password strength calculation
  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 4);
  }, [formData.password]);

  const validate = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Minimum 6 characters required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Clear global errors on input
    if (uiState.globalError) setUiState(prev => ({ ...prev, globalError: '', isAlreadyRegistered: false }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUiState(prev => ({ ...prev, loading: true, globalError: '' }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setUiState(prev => ({ ...prev, isAlreadyRegistered: true, globalError: 'An account with this email already exists.' }));
          return;
        }
        throw error;
      }

      if (data?.user && !data?.session) {
        setUiState(prev => ({ ...prev, successState: 'confirmation_required' }));
      } else {
        setUiState(prev => ({ ...prev, successState: 'complete' }));
        setTimeout(() => onNavigate('dashboard'), 2000);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setUiState(prev => ({ ...prev, globalError: err.message || 'Failed to create account. Please try again.' }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  if (uiState.successState === 'confirmation_required') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-20">
        <MotionDiv 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-zinc-900 border border-lime-500/30 p-10 md:p-16 rounded-[3rem] text-center max-w-xl w-full shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500 to-cyan-500"></div>
          <div className="w-24 h-24 bg-lime-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-lime-500/20">
            <Mail className="w-12 h-12 text-lime-400 animate-pulse" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-6 uppercase tracking-tighter leading-none">
            Verify Your <span className="text-lime-400">Enlistment</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
            An encrypted link has been dispatched to:<br/>
            <span className="text-white font-black block mt-2 text-xl">{formData.email}</span>
          </p>
          <div className="space-y-6">
            <button 
              onClick={() => onNavigate('login')} 
              className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl hover:bg-lime-500 transition-all tracking-[0.2em] shadow-2xl active:scale-95"
            >
              PROCEED TO LOGIN
            </button>
            <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest flex items-center justify-center gap-2">
              <Zap className="w-3 h-3" /> Didn't receive the uplink? Check your spam folder.
            </p>
          </div>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-16 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <MotionDiv 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative z-10"
      >
        <button 
          onClick={() => onNavigate('home')} 
          className="absolute top-10 left-10 text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-12 mt-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-lime-500/20 rounded-2xl flex items-center justify-center border border-zinc-700/50 shadow-inner group">
              <Zap className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3 uppercase tracking-tighter leading-none">
            New <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Enlistment</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Create Your Performance Profile</p>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-lime-500 mx-auto rounded-full"></div>
        </div>

        {uiState.globalError && (
          <MotionDiv 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className={`mb-10 p-6 rounded-2xl flex items-start gap-4 text-sm border ${uiState.isAlreadyRegistered ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-black uppercase text-xs mb-3">{uiState.globalError}</p>
              {uiState.isAlreadyRegistered && (
                <button 
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-2 bg-cyan-500 text-black px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  <LogIn className="w-4 h-4" /> AUTHORIZE EXISTING SESSION
                </button>
              )}
            </div>
          </MotionDiv>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">First Name</label>
              <div className="relative group">
                <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldErrors.firstName ? 'text-red-500' : 'text-zinc-700 group-focus-within:text-cyan-400'}`} />
                <input 
                  name="firstName" 
                  type="text" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  className={`w-full bg-zinc-950 border-2 rounded-2xl p-4 pl-14 text-white placeholder-zinc-800 focus:outline-none transition-all ${fieldErrors.firstName ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-cyan-500'}`} 
                  placeholder="e.g., John" 
                />
              </div>
              {fieldErrors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 animate-pulse">{fieldErrors.firstName}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Last Name</label>
              <input 
                name="lastName" 
                type="text" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                className={`w-full bg-zinc-950 border-2 rounded-2xl p-4 text-white placeholder-zinc-800 focus:outline-none transition-all ${fieldErrors.lastName ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-cyan-500'}`} 
                placeholder="e.g., Doe" 
              />
              {fieldErrors.lastName && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 animate-pulse">{fieldErrors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Identity Address (Email)</label>
            <div className="relative group">
              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-zinc-700 group-focus-within:text-cyan-400'}`} />
              <input 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className={`w-full bg-zinc-950 border-2 rounded-2xl p-4 pl-14 text-white placeholder-zinc-800 focus:outline-none transition-all ${fieldErrors.email || uiState.isAlreadyRegistered ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-cyan-500'}`} 
                placeholder="you@example.com" 
              />
            </div>
            {fieldErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 animate-pulse">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Security Secret (Password)</label>
            <div className="relative group">
              <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldErrors.password ? 'text-red-500' : 'text-zinc-700 group-focus-within:text-cyan-400'}`} />
              <input 
                name="password" 
                type={uiState.showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleInputChange} 
                className={`w-full bg-zinc-950 border-2 rounded-2xl p-4 pl-14 pr-14 text-white placeholder-zinc-800 focus:outline-none transition-all ${fieldErrors.password ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-cyan-500'}`} 
                placeholder="Min. 6 characters" 
              />
              <button 
                type="button" 
                onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                aria-label={uiState.showPassword ? "Hide password" : "Show password"}
              >
                {uiState.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-red-500 text-[10px] font-bold uppercase ml-2 animate-pulse">{fieldErrors.password}</p>}
            
            {/* Visual Security Rating */}
            <div className="mt-5 bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800/50 backdrop-blur-sm shadow-inner overflow-hidden relative">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Shield className="w-16 h-16 text-white" />
              </div>
              <div className="flex gap-1.5 h-1.5 mb-4">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level}
                    className={`flex-1 rounded-full transition-all duration-700 ${
                      formData.password.length > 0 && passwordStrength >= level 
                        ? (passwordStrength <= 2 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.3)]' : passwordStrength === 3 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]') 
                        : 'bg-zinc-900'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest flex items-center gap-2">
                  <ShieldCheck className={`w-3.5 h-3.5 ${passwordStrength === 4 ? 'text-cyan-400' : 'text-zinc-700'}`} /> 
                  CYBERNETIC STRENGTH GRADE
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                  passwordStrength === 0 ? 'text-zinc-700' :
                  passwordStrength <= 2 ? 'text-red-500' : 
                  passwordStrength === 3 ? 'text-yellow-500' : 'text-cyan-400'
                }`}>
                  {formData.password.length === 0 ? 'UNDEFINED' : 
                   passwordStrength <= 2 ? 'VULNERABLE' : 
                   passwordStrength === 3 ? 'SECURE' : 'UNBREAKABLE'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={uiState.loading} 
              className="w-full bg-gradient-to-r from-cyan-500 to-lime-400 text-black font-black uppercase py-6 rounded-2xl hover:brightness-110 shadow-[0_15px_35px_rgba(34,211,238,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-4 tracking-[0.3em] active:scale-95 group"
            >
              {uiState.loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>INITIATE PROFILE <CheckCircle2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /></>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center text-[10px] text-zinc-600 font-black uppercase tracking-widest bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/30">
          Already enlisted? <button onClick={() => onNavigate('login')} className="text-white font-black hover:text-cyan-400 underline decoration-cyan-500/30 transition-colors">Authorize Access Here</button>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800 flex items-center justify-center gap-4 text-zinc-700">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em]">Secure Protocol v2.5</span>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Signup;
