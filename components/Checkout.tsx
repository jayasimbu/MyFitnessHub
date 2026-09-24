
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Loader2, CheckCircle, AlertCircle, MapPin, Lock, LogIn, Eye, EyeOff, Shield, ChevronRight, Zap } from 'lucide-react';
import { PricingPlan } from '../types';
import { supabase } from '../lib/supabaseClient';

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

interface CheckoutProps {
  plan: PricingPlan;
  onNavigate: (page: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ plan, onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          email: session.user.email || '',
          firstName: session.user.user_metadata?.first_name || '',
          lastName: session.user.user_metadata?.last_name || '',
        }));
      }
    });
  }, []);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    return score; // Max 4
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
        errors.firstName = 'Required';
        isValid = false;
    }
    if (!formData.lastName.trim()) {
        errors.lastName = 'Required';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.email = 'Valid email required';
        isValid = false;
    }

    if (!user && (!formData.password || formData.password.length < 6)) {
        errors.password = 'Min 6 chars';
        isValid = false;
    }

    if (!formData.street.trim()) {
        errors.street = 'Street Address required';
        isValid = false;
    }
    if (!formData.city.trim()) {
        errors.city = 'City required';
        isValid = false;
    }

    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(formData.zip)) {
        errors.zip = '6-digit Zip required';
        isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'password') setPasswordStrength(calculateStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
        setErrorMessage('Check your parameters and retry.');
        return;
    }

    setLoading(true);

    try {
      if (!user) {
          const { data: authData, error: authError } = await supabase.auth.signUp({
              email: formData.email.trim(),
              password: formData.password,
              options: {
                  data: {
                      first_name: formData.firstName,
                      last_name: formData.lastName,
                  }
              }
          });
          if (authError) throw authError;
      }

      const numericPrice = parseFloat(plan.price.replace(/[^0-9.]/g, ''));

      // Bug Fix: Missing subscription_status caused Dashboard to always show 'Inactive'
      const { error } = await supabase
        .from('gym_subscriptions')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phone,
            street_address: formData.street,
            city: formData.city,
            zip_code: formData.zip,
            membership_plan: plan.name,
            total_paid: numericPrice,
            subscription_status: 'active',
          },
        ]);

      if (error) throw error;

      setStatus('success');
      setTimeout(() => onNavigate('dashboard'), 4000);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Transmission failure. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-lime-500 p-12 md:p-20 rounded-[3rem] text-center max-w-2xl w-full shadow-2xl"
        >
          <div className="w-24 h-24 bg-lime-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(132,204,22,0.4)]">
            <CheckCircle className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 uppercase tracking-tighter leading-none">Access <span className="text-lime-400">Granted</span></h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
            Welcome to the elite tier, <span className="text-white font-black">{formData.firstName}</span>. Your enlistment is confirmed.
            {!user && " Verify your signal via the link in your inbox."}
          </p>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Synchronizing Profiles...</p>
          </div>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Order Summary Sidebar */}
        <div className="bg-zinc-950 p-8 md:p-12 lg:w-[400px] border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col">
           <button 
              onClick={() => onNavigate('home')}
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-3 mb-10 font-black uppercase text-[10px] tracking-widest"
          >
              <ArrowLeft className="w-5 h-5" /> Return to Hub
          </button>
          
          <h3 className="text-xl font-heading font-bold text-zinc-500 mb-8 uppercase tracking-widest">Selected Tier</h3>
          
          <div className="flex-1">
            <MotionDiv 
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900 p-6 rounded-3xl border-2 border-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.1)] mb-8"
            >
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Protocol Name</p>
                <h4 className="text-3xl font-heading font-bold text-white mb-1 uppercase tracking-tighter">{plan.name}</h4>
                <div className="flex items-baseline gap-2 mt-4 pt-4 border-t border-zinc-800">
                    <span className="text-4xl font-heading font-bold text-lime-400">{plan.price}</span>
                    <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{plan.period}</span>
                </div>
            </MotionDiv>
            
            <ul className="space-y-4">
                {plan.features.map((f, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex items-center gap-3 font-medium">
                        <div className="w-2 h-2 bg-zinc-800 border border-lime-500/50 rounded-full"></div> {f}
                    </li>
                ))}
            </ul>
          </div>
          
          <div className="mt-12 pt-8 border-t border-zinc-800 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Base Rate</span>
                <span className="text-white font-bold">{plan.price}</span>
             </div>
             <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
                <span className="text-white font-black uppercase text-xs tracking-widest">Total Investment</span>
                <span className="text-4xl font-heading font-bold text-lime-400">{plan.price}</span>
             </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 md:p-12 lg:p-16 lg:flex-1 h-auto lg:max-h-[85vh] overflow-y-auto custom-scrollbar">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
               <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-400 border border-lime-500/20 shadow-inner">
                       <CreditCard className="w-8 h-8" />
                   </div>
                   <div>
                       <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-tighter">Registration</h2>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Final Step to Activation</p>
                   </div>
               </div>
               {!user && (
                   <button 
                       type="button"
                       onClick={() => onNavigate('login')}
                       className="text-[9px] text-lime-400 font-black uppercase tracking-widest flex items-center gap-2 hover:bg-lime-500/10 border border-lime-500/30 px-5 py-3 rounded-2xl transition-all active:scale-95"
                   >
                       <LogIn className="w-4 h-4" /> Already Enlisted? Authorize
                   </button>
               )}
           </div>

           {status === 'error' && (
             <div className="mb-10 bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4 text-red-400 animate-pulse">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-black uppercase tracking-tight leading-relaxed">{errorMessage}</p>
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Identity Segment */}
              <div className="space-y-6">
                  <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] border-b border-zinc-800 pb-4 mb-8 flex items-center gap-3">
                      <Zap className="w-3 h-3 text-lime-400" /> Identity Uplink
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">First Name</label>
                        <input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            type="text" 
                            disabled={!!user}
                            className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all ${user ? 'opacity-50 cursor-not-allowed border-zinc-900' : fieldErrors.firstName ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Last Name</label>
                        <input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            type="text" 
                            disabled={!!user}
                            className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all ${user ? 'opacity-50 cursor-not-allowed border-zinc-900' : fieldErrors.lastName ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                            placeholder="Doe"
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Signal Address (Email)</label>
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            disabled={!!user}
                            className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all ${user ? 'opacity-50 cursor-not-allowed border-zinc-900' : fieldErrors.email ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                            placeholder="you@domain.fit"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Primary Comms (Phone)</label>
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel" 
                            className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all border-zinc-800 focus:border-lime-500`}
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                  </div>

                  {!user && (
                    <MotionDiv 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-zinc-950 p-6 rounded-[2rem] border-2 border-lime-500/20 shadow-inner"
                    >
                        <label className="block text-lime-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                             <Lock className="w-4 h-4" /> Secret Credential (Password)
                        </label>
                        <div className="relative mb-5">
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full bg-zinc-900 border-2 rounded-2xl p-5 pr-14 text-white focus:outline-none transition-all ${fieldErrors.password ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                            </button>
                        </div>
                        
                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 shadow-inner">
                            <div className="flex gap-1.5 h-1.5 mb-3">
                                {[1, 2, 3, 4].map((level) => (
                                    <div 
                                        key={level}
                                        className={`flex-1 rounded-full transition-all duration-300 ${
                                            formData.password.length > 0 && passwordStrength >= level 
                                                ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-yellow-500' : 'bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)]') 
                                                : 'bg-zinc-900'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> SECURITY GRADE
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                                    passwordStrength === 0 ? 'text-zinc-700' :
                                    passwordStrength <= 2 ? 'text-red-500' : 
                                    passwordStrength === 3 ? 'text-yellow-500' : 'text-lime-500'
                                }`}>
                                    {formData.password.length === 0 ? 'UNDEFINED' : 
                                     passwordStrength <= 2 ? 'WEAK' : 
                                     passwordStrength === 3 ? 'SECURE' : 'ELITE'}
                                </span>
                            </div>
                        </div>
                    </MotionDiv>
                  )}
              </div>

              {/* Location Segment */}
              <div className="space-y-6 pt-6">
                 <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] border-b border-zinc-800 pb-4 mb-8 flex items-center gap-3">
                    <MapPin className="w-3 h-3 text-cyan-400" /> Tactical Coordinates
                 </h4>
                 <div>
                    <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Street Address</label>
                    <input 
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        type="text" 
                        className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all ${fieldErrors.street ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                        placeholder="123 Performance St"
                    />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">City</label>
                        <input 
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            type="text" 
                            className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all ${fieldErrors.city ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                            placeholder="Salem"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Zip Code</label>
                        <input 
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            type="text" 
                            className={`w-full bg-zinc-950 border-2 rounded-2xl p-5 text-white focus:outline-none transition-all ${fieldErrors.zip ? 'border-red-500' : 'border-zinc-800 focus:border-lime-500'}`}
                            placeholder="636001"
                        />
                    </div>
                 </div>
              </div>

              <div className="pt-10">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-white text-black font-black uppercase py-6 rounded-2xl hover:bg-lime-500 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 disabled:opacity-70 tracking-[0.3em] group active:scale-95"
                  >
                    {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <>ACTIVATE PROTOCOL <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-8">
                     <div className="flex items-center gap-2 text-zinc-700 text-[9px] font-black uppercase tracking-widest">
                        <Lock className="w-3 h-3" /> 256-BIT ENCRYPTION
                     </div>
                     <div className="w-px h-3 bg-zinc-800"></div>
                     <div className="flex items-center gap-2 text-zinc-700 text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> INSTANT CLEARANCE
                     </div>
                  </div>
              </div>
           </form>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Checkout;
