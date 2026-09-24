
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AdminLoginProps {
    onNavigate: (page: string) => void;
}

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      const user = data.user;
      const isAdmin = user?.user_metadata?.is_admin === true || 
                      user?.app_metadata?.role === 'admin' ||
                      email.toLowerCase().includes('admin@myfitnesshub.fit');

      if (!isAdmin) {
          await supabase.auth.signOut();
          setError('Access Denied: Your account does not have administrator clearance.');
          setLoading(false);
          return;
      }
      
      onNavigate('admin-dashboard');
    } catch (err: any) {
      console.error('Admin Login error:', err);
      if (err.message.toLowerCase().includes('invalid login credentials')) {
         setError('Invalid admin credentials. Access to Command Hub is restricted.');
      } else {
         setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <MotionDiv 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <button onClick={() => onNavigate('home')} className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 mt-4">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                     <ShieldCheck className="w-8 h-8 text-red-500" />
                </div>
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Command Hub</h2>
            <p className="text-zinc-400 text-sm">Administrator authentication required.</p>
        </div>

        {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-400 text-sm leading-relaxed">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> 
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Admin Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-700" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-red-500 transition-all"
                        placeholder="admin@myfitnesshub.fit"
                    />
                </div>
                <p className="mt-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Master Auth: admin@myfitnesshub.fit</p>
            </div>
            <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pr-10 text-white focus:outline-none focus:border-red-500 transition-all"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold uppercase py-4 rounded-lg hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 mt-6">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Authenticate</>}
            </button>
        </form>
      </MotionDiv>
    </div>
  );
};

export default AdminLogin;
