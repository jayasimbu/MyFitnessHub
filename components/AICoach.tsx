
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, Loader2, Save, CheckCircle, Flame, Dumbbell, Zap, History, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Fix: Cast motion components to any to resolve type errors
const MotionDiv = motion.div as any;

const AICoach: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setLoading(true);
    setResponse('');
    setSaveSuccess(false);

    try {
      const prompt = `
        You are 'Fitness Hub AI', an elite fitness coach. 
        Goal: "${goal}".
        Level: "${level}".
        
        Create a high-intensity, professional daily workout. 
        Format your response CLEARLY with the following structure:
        ### [Workout Name]
        **Focus:** [Goal]
        ---
        #### Phase 1: Warmup
        * Exercise 1 (Sets x Reps)
        #### Phase 2: Main Session
        * Exercise 2 (Sets x Reps)
        #### Phase 3: Cool Down
        * Exercise 3
        ---
        **Coach's Tip:** [Intense motivational tip]
      `;

      const { data, error } = await supabase.functions.invoke('gemini', {
        body: { prompt }
      });

      if (error) {
        throw error;
      }

      setResponse(data.text || "Could not generate plan.");
    } catch (error) {
      console.error("AI Error:", error);
      setResponse("System overload. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = async () => {
    if (!user || !response) return;
    setSaving(true);
    setSaveError('');
    try {
      const { error } = await supabase
        .from('user_workouts')
        .insert([{
          user_id: user.id,
          goal: goal,
          workout_content: response,
          level: level,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="ai-coach" className="py-20 md:py-32 bg-zinc-950 border-y border-zinc-900 relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-lime-500/50 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 md:w-[500px] h-64 md:h-[500px] bg-lime-500/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-[500px] h-64 md:h-[500px] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20">
            <MotionDiv 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8 shadow-2xl"
            >
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Neural Performance Architect</span>
            </MotionDiv>
            <h2 className="text-5xl md:text-8xl font-heading font-bold text-white mb-8 tracking-tighter leading-none">
                AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">COACHING</span>
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">
                Engineered for those who demand elite results. Our neural core generates tactical workout protocols in real-time.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
            {/* Control Deck */}
            <MotionDiv 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 bg-zinc-900/40 backdrop-blur-xl p-8 md:p-12 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                <form onSubmit={handleGenerate} className="relative z-10 space-y-8 md:space-y-10">
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Tactical Objective</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="E.g. Explosive Vertical, Chest Hypertrophy..."
                                className="w-full bg-zinc-950 border-2 border-zinc-800 p-5 md:p-6 text-white placeholder-zinc-700 focus:outline-none focus:border-lime-500 transition-all rounded-2xl text-lg shadow-inner group-hover:border-zinc-700"
                            />
                            <Flame className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-lime-500 w-6 h-6 transition-colors" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Complexity Tier</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setLevel(lvl)}
                                    className={`py-4 md:py-5 text-[10px] md:text-xs font-black uppercase rounded-2xl border-2 transition-all duration-300 ${
                                        level === lvl 
                                        ? 'bg-lime-500 text-black border-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.4)] scale-105' 
                                        : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-600 hover:text-zinc-400'
                                    }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !goal}
                        className="w-full py-5 md:py-6 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-lime-500 transition-all rounded-2xl disabled:opacity-30 flex items-center justify-center gap-4 shadow-2xl group active:scale-95"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:fill-current" />}
                        {loading ? 'ARCHITECTING...' : 'INITIATE PROTOCOL'}
                    </button>
                    
                    {!user && !loading && (
                        <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                            * Login to save generated routines to your library
                        </p>
                    )}
                </form>
            </MotionDiv>

            {/* Tactical Output */}
            <MotionDiv 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 min-h-[500px] md:min-h-[650px] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-1 relative overflow-hidden shadow-2xl group"
            >
                 <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-black"></div>
                 
                 <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {response ? (
                            <MotionDiv 
                                key="output"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-8 border-b border-zinc-800 gap-6">
                                     <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner">
                                            <Bot className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-heading font-bold text-2xl uppercase tracking-tight">Mission Brief</h4>
                                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Tier: {level} Opti-Core</p>
                                        </div>
                                     </div>
                                     
                                     {user && (
                                         <button 
                                            onClick={saveWorkout}
                                            disabled={saving || saveSuccess}
                                            className={`w-full sm:w-auto px-6 py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest ${
                                                saveSuccess 
                                                ? 'bg-lime-500/10 border-lime-500 text-lime-400' 
                                                : saveError
                                                ? 'bg-red-500/10 border-red-500 text-red-400'
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800'
                                            }`}
                                         >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                            {saveSuccess ? 'Mission Stored' : saveError ? 'Save Failed' : 'Save to Profile'}
                                         </button>
                                     )}
                                </div>
                                <div className="space-y-6 text-zinc-300 font-medium leading-relaxed max-h-[350px] md:max-h-[450px] overflow-y-auto pr-6 custom-scrollbar">
                                    {response.split('\n').map((line, i) => {
                                        if (line.trim() === '') return null;
                                        if (line.startsWith('###')) return <h3 key={i} className="text-3xl font-heading text-lime-400 mt-8 mb-4 tracking-tight border-l-4 border-lime-500 pl-4">{line.replace('###', '')}</h3>;
                                        if (line.startsWith('####')) return <h4 key={i} className="text-xl font-heading text-cyan-400 mt-6 mb-2 uppercase tracking-wide flex items-center gap-2"><ChevronRight className="w-4 h-4" /> {line.replace('####', '')}</h4>;
                                        if (line.startsWith('**Coach\'s Tip:**')) return (
                                            <MotionDiv 
                                                key={i} 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-zinc-900/80 p-6 rounded-3xl border-2 border-lime-500/20 my-8 italic text-base text-zinc-400 leading-relaxed shadow-xl relative"
                                            >
                                                <div className="absolute -top-3 left-6 bg-lime-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-tighter">Pro Insight</div>
                                                {line}
                                            </MotionDiv>
                                        );
                                        if (line.includes('---')) return <hr key={i} className="border-zinc-800 my-8 opacity-50" />;
                                        return <p key={i} className="mb-2 text-sm md:text-lg text-zinc-400 hover:text-white transition-colors">{line}</p>;
                                    })}
                                </div>
                            </MotionDiv>
                        ) : (
                            <MotionDiv 
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-zinc-800"
                            >
                                <div className="relative mb-8">
                                    <Bot className="w-24 md:w-32 h-24 md:h-32 opacity-10 animate-pulse" />
                                    <div className="absolute inset-0 bg-lime-500/5 blur-3xl animate-pulse"></div>
                                </div>
                                <p className="text-center max-w-xs text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-40 leading-loose">
                                    System Standby. <br/>
                                    Waiting for Objective Parameters.
                                </p>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                 </div>
                 
                 {/* Cyberpunk Accents */}
                 <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-lime-500/10 rounded-tr-[2.5rem]"></div>
                 <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/10 rounded-bl-[2.5rem]"></div>
            </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default AICoach;
