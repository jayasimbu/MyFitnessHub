
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Calendar, Activity, LogOut, Loader2, MapPin, Mail, Phone, BookOpen, Clock, ChevronRight, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import WorkoutCalendar from './WorkoutCalendar';

interface SubscriptionData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  zip_code: string;
  membership_plan: string;
  subscription_status: string;
  created_at: string;
}

interface SavedWorkout {
    id: string;
    goal: string;
    level: string;
    workout_content: string;
    created_at: string;
}

interface DashboardProps {
  onNavigate: (page: string) => void;
}

// Fix: Cast motion components to any to resolve type errors
const MotionDiv = motion.div as any;

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<SavedWorkout | null>(null);

  // Bug Fix: [onNavigate] caused infinite re-fetch because the function reference
  // changes on every parent render. Use [] to fetch only once on mount.
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNavigate('login');
        return;
      }

      setUserEmail(user.email || '');

      // Fetch Subscriptions
      const { data: sData } = await supabase
        .from('gym_subscriptions')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sData) setSubData(sData);

      // Fetch Saved Workouts
      const { data: wData } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (wData) setSavedWorkouts(wData);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this routine?')) return;
    try {
        const { error } = await supabase.from('user_workouts').delete().eq('id', id);
        if (error) throw error;
        setSavedWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (err) {
        console.error("Delete error:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-950 pt-28 pb-16 px-4 selection:bg-lime-500/30">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-900 pb-8">
            <div>
                <h1 className="text-5xl font-heading font-bold text-white mb-2 tracking-tighter">
                    ATHLETE <span className="text-lime-400">HUB</span>
                </h1>
                <p className="text-zinc-500 font-medium">Clearance Level: <span className="text-white uppercase font-black tracking-widest text-xs">{subData?.membership_plan || 'Candidate'}</span></p>
            </div>
            <button 
                onClick={handleLogout}
                className="mt-6 md:mt-0 flex items-center gap-2 text-zinc-600 hover:text-red-500 transition-all uppercase font-black text-[10px] tracking-[0.2em] bg-zinc-900 px-5 py-2.5 rounded-xl border border-zinc-800"
            >
                <LogOut className="w-4 h-4" /> Terminate Session
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Profile Section */}
            <div className="space-y-8">
                <MotionDiv 
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-16 bg-lime-500/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 text-lime-400 group-hover:border-lime-500/50 transition-colors">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-heading font-bold text-white">{subData?.first_name || 'Anonymous'}</h3>
                                <p className="text-xs text-zinc-500 font-mono">{userEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <DetailItem icon={Phone} value={subData?.phone_number || 'No contact uplink'} />
                            <DetailItem icon={MapPin} value={subData?.street_address ? `${subData.street_address}, ${subData.city}` : 'No HQ Address'} />
                        </div>
                    </div>
                </MotionDiv>

                {/* Subscription Status Card */}
                <MotionDiv 
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Deployment Status</h3>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            subData?.subscription_status === 'active' 
                            ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                            {subData?.subscription_status || 'Inactive'}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                             <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-cyan-500" />
                                <span className="text-xs text-zinc-400">Enlisted</span>
                             </div>
                             <span className="text-xs font-bold text-white">{subData?.created_at ? new Date(subData.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                             <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-purple-500" />
                                <span className="text-xs text-zinc-400">Next Bill</span>
                             </div>
                             <span className="text-xs font-bold text-white">Manual</span>
                        </div>
                    </div>
                </MotionDiv>
            </div>

            {/* Content Section: Workouts */}
            <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
                        <BookOpen className="text-lime-400" /> ROUTINE <span className="text-zinc-600">LIBRARY</span>
                    </h2>
                    <button onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('ai-coach')?.scrollIntoView(), 100); }} className="text-[9px] font-black uppercase bg-lime-500 text-black px-4 py-2 rounded-lg tracking-widest hover:scale-105 transition-transform">
                        New Brief
                    </button>
                </div>

                {savedWorkouts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedWorkouts.map((workout, idx) => (
                            <MotionDiv 
                                key={workout.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25, delay: idx * 0.05 }}
                                onClick={() => setSelectedWorkout(workout)}
                                className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-zinc-600 transition-all group cursor-pointer relative"
                            >
                                <button 
                                    onClick={(e) => deleteWorkout(workout.id, e)}
                                    className="absolute top-4 right-4 p-2 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-lime-500/10 flex items-center justify-center text-lime-400">
                                        <Activity size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{workout.level}</span>
                                </div>
                                <h4 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">{workout.goal}</h4>
                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold">
                                        <Clock size={12} /> {new Date(workout.created_at).toLocaleDateString()}
                                    </div>
                                    <ChevronRight size={16} className="text-zinc-700 group-hover:translate-x-1 group-hover:text-white transition-all" />
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                ) : (
                    <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 p-16 rounded-3xl text-center">
                        <BookOpen className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-600 uppercase font-black text-[10px] tracking-[0.2em]">Empty Library</p>
                        <button onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('ai-coach')?.scrollIntoView(), 100); }} className="mt-4 text-lime-400 text-[10px] font-bold uppercase underline">Consult AI Coach</button>
                    </div>
                )}
            </div>
        </div>

        <WorkoutCalendar workouts={savedWorkouts} onSelectWorkout={setSelectedWorkout} />
      </div>

      {/* Routine Detail Modal */}
      <AnimatePresence>
        {selectedWorkout && (
            <>
                <MotionDiv 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedWorkout(null)}
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
                />
                <MotionDiv 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-zinc-950 border-l border-zinc-900 z-[101] shadow-2xl p-8 md:p-12 overflow-y-auto"
                >
                    <button onClick={() => setSelectedWorkout(null)} className="absolute top-8 left-8 text-zinc-600 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                    <div className="mt-16">
                        <span className="text-[10px] font-black uppercase text-lime-500 tracking-[0.3em] mb-4 block">Deployment Protocol</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-1 tracking-tighter">{selectedWorkout.goal}</h2>
                        <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest mb-10">Optimized for {selectedWorkout.level} Tier</p>
                        
                        <div className="prose prose-invert max-w-none text-zinc-300 font-medium leading-relaxed">
                            {selectedWorkout.workout_content.split('\n').map((line, i) => {
                                if (line.startsWith('###')) return <h3 key={i} className="text-2xl font-heading text-lime-400 mt-8 mb-3">{line.replace('###', '')}</h3>;
                                if (line.startsWith('####')) return <h4 key={i} className="text-lg font-heading text-cyan-400 mt-6 mb-2 uppercase tracking-tight">{line.replace('####', '')}</h4>;
                                if (line.startsWith('**Coach\'s Tip:**')) return <div key={i} className="bg-zinc-900 p-6 rounded-2xl border-l-4 border-lime-500 my-8 italic text-sm text-zinc-400 leading-relaxed shadow-xl">{line}</div>;
                                if (line.includes('---')) return <hr key={i} className="border-zinc-900 my-6" />;
                                return <p key={i} className="mb-2 text-sm md:text-base">{line}</p>;
                            })}
                        </div>
                    </div>
                </MotionDiv>
            </>
        )}
      </AnimatePresence>
    </section>
  );
};

const DetailItem = ({ icon: Icon, value }: { icon: any, value: string }) => (
    <div className="flex items-center gap-4 text-zinc-400 text-sm">
        <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700">
            <Icon size={18} />
        </div>
        <span className="font-medium">{value}</span>
    </div>
);

export default Dashboard;
