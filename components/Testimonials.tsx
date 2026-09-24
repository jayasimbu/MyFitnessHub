
import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '../types';
import { Quote } from 'lucide-react';

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Simbu',
    role: 'Member since 2021',
    quote: "The energy in MyFitness Hub is unmatched. The trainers push you to your absolute limit but in the best way possible. I've never been stronger.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 't2',
    name: 'Surya',
    role: 'Bodybuilder',
    quote: "I was skeptical about the facilities, but everything here is top notch. The transformation I achieved in 6 months is insane!",
    avatar: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 't3',
    name: 'Ajay',
    role: 'Athlete',
    quote: "This isn't just a gym; it's a training ground for champions. The equipment is top-tier and the community is incredibly supportive.",
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
  },
];

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-zinc-950 relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-900 to-transparent skew-x-12 opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Success <span className="text-lime-400">Stories</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <MotionDiv
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-zinc-900/50 backdrop-blur-sm p-8 border border-zinc-800 relative hover:border-zinc-600 transition-colors"
            >
              <Quote className="w-10 h-10 text-zinc-700 absolute top-6 right-6" />
              <p className="text-zinc-300 italic mb-8 relative z-10">"{t.quote}"</p>
              
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-lime-400 object-cover" />
                <div>
                  <h5 className="text-white font-bold font-heading uppercase">{t.name}</h5>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide">{t.role}</p>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
