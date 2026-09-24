import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Dumbbell } from 'lucide-react';

// Bug Fix: motion.div used directly causes TS errors with strict Framer Motion types
const MotionDiv = motion.div as any;

interface SavedWorkout {
    id: string;
    goal: string;
    level: string;
    workout_content: string;
    created_at: string;
}

interface WorkoutCalendarProps {
    workouts: SavedWorkout[];
    onSelectWorkout: (workout: SavedWorkout) => void;
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ workouts, onSelectWorkout }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="p-2 border-b border-r border-zinc-800/30 bg-zinc-950/30"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayWorkouts = workouts.filter(w => w.created_at.startsWith(dateStr));
        
        days.push(
            <MotionDiv 
                key={`day-${i}`} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="min-h-[100px] p-2 border-b border-r border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors flex flex-col items-start gap-1 overflow-hidden"
            >
                <span className="text-zinc-500 font-mono text-[10px] font-bold">{i}</span>
                <div className="flex flex-col gap-1 w-full mt-1">
                    {dayWorkouts.map(w => (
                        <button 
                            key={w.id} 
                            onClick={() => onSelectWorkout(w)}
                            className="w-full text-left text-[9px] truncate bg-lime-500/10 text-lime-400 hover:bg-lime-500/20 px-2 py-1.5 rounded transition-colors group flex items-center"
                            title={w.goal}
                        >
                            <Dumbbell className="w-3 h-3 inline mr-1 group-hover:rotate-12 transition-transform shrink-0" />
                            <span className="truncate">{w.goal}</span>
                        </button>
                    ))}
                </div>
            </MotionDiv>
        );
    }

    return (
        <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 mt-10 shadow-2xl"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
                    <CalendarIcon className="text-lime-400" /> TRAINING <span className="text-zinc-600">CALENDAR</span>
                </h2>
                <div className="flex items-center gap-4 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    <button onClick={prevMonth} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-white font-bold uppercase tracking-widest text-xs min-w-[120px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={nextMonth} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            
            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                <div className="grid grid-cols-7 border-b border-zinc-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] py-3 bg-zinc-900/50 border-r border-zinc-800 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-fr">
                    {days}
                </div>
            </div>
        </MotionDiv>
    );
};

export default WorkoutCalendar;
