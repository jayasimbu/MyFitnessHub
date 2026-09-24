
import React from 'react';
import { motion } from 'framer-motion';
import { Program } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const programs: Program[] = [
  {
    id: 'p1',
    title: 'The Shredder 30',
    duration: '30 Days',
    price: '₹5,999',
    // Real generated image — local asset
    image: '/images/program_shredder.jpg',
    benefits: ['Daily HIIT Workouts', 'Meal Plan Included', '24/7 Coach Support', 'Fat Loss Focus'],
  },
  {
    id: 'p2',
    title: 'Hypertrophy Max',
    duration: '12 Weeks',
    price: '₹11,999',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    benefits: ['4-Day Split Routine', 'Progressive Overload', 'Form Analysis', 'Muscle Gain Focus'],
  },
  {
    id: 'p3',
    title: 'Athlete Performance',
    duration: '6 Months',
    price: '₹29,999',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
    benefits: ['Sport Specific Drills', 'Power & Agility', 'Recovery Protocols', 'Competition Prep'],
  },
];

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const Programs: React.FC = () => {
  return (
    <section id="programs" className="py-20 bg-zinc-950 perspective-1000">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
              Featured <span className="text-cyan-400">Programs</span>
            </h2>
            <p className="text-zinc-400">Structured paths to reach your peak performance.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-lime-400 font-bold uppercase tracking-wider hover:text-white transition-colors">
            View All Programs <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <MotionDiv
              key={program.id}
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{ scale: 1.02, rotateY: -5, zIndex: 10 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 hover:border-cyan-400 transition-all duration-300 group flex flex-col h-full transform-style-3d shadow-2xl"
            >
              <div className="h-48 overflow-hidden relative">
                 <div className="absolute inset-0 bg-zinc-950/50 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                 <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute top-4 right-4 z-20 bg-lime-500 text-black font-bold text-xs px-2 py-1 uppercase rounded shadow-lg">
                    {program.duration}
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold font-heading text-white mb-2 group-hover:text-cyan-400 transition-colors">{program.title}</h3>
                <div className="text-3xl font-bold text-lime-400 mb-6">{program.price}</div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {program.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-zinc-600 group-hover:text-lime-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 border border-zinc-700 text-white font-bold uppercase tracking-wide hover:bg-cyan-500 hover:border-cyan-500 hover:text-black transition-all duration-300 shadow-md">
                  Select Program
                </button>
              </div>
            </MotionDiv>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
            <button className="flex items-center gap-2 text-lime-400 font-bold uppercase tracking-wider mx-auto hover:text-white transition-colors">
                View All Programs <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
