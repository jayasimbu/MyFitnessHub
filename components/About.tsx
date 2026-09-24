
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Trophy, Timer } from 'lucide-react';

const stats = [
  { icon: Award, value: "12+", label: "Years Experience" },
  { icon: Users, value: "1.2k+", label: "Members Transformed" },
  { icon: Trophy, value: "PRO", label: "IFBB Athlete" },
  { icon: Timer, value: "24/7", label: "Elite Access" },
];

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <MotionDiv 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative perspective-1000 group"
          >
            <div className="absolute -inset-4 bg-lime-500/20 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <MotionDiv
               whileHover={{ rotateY: 5, rotateX: 2 }}
               transition={{ type: "spring", stiffness: 200 }}
               className="relative z-10 transform-style-3d"
            >
                <img 
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" 
                alt="Coach Simbu" 
                className="w-full h-[650px] object-cover rounded-2xl border border-zinc-800 grayscale-0 shadow-2xl"
                />
                <div className="absolute bottom-8 left-[-15px] bg-zinc-900 border border-zinc-800 p-6 shadow-2xl z-20 max-w-xs group-hover:translate-x-4 transition-transform rounded-xl">
                    <h3 className="text-2xl font-heading text-white font-bold mb-1">Coach Simbu</h3>
                    <p className="text-lime-400 font-bold uppercase text-[10px] tracking-widest border-t border-zinc-800 pt-2">Head of Performance & Founder</p>
                </div>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-lime-400 font-bold uppercase text-xs tracking-widest mb-4">
                <div className="w-10 h-0.5 bg-lime-500"></div>
                The Legend of Salem
            </div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-8 text-white leading-none">
                BUILT BY <span className="text-lime-400">WILL</span>, <br/>
                FUELLED BY <span className="text-cyan-400">PASSION</span>.
            </h2>
            <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
              Coach <strong>Simbu</strong> is a pioneer in the Salem fitness scene. With over a decade of competing at the highest levels of bodybuilding, he brings a level of intensity and scientific precision that is rare in general gyms.
            </p>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              "My mission is simple: To provide the elite training environment I wished I had when I started. No egos, no excuses—just pure performance and results that speak for themselves."
            </p>

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <MotionDiv 
                    key={idx} 
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col gap-2 p-5 bg-zinc-900/40 rounded-2xl border border-zinc-800 hover:border-lime-500/50 transition-all"
                >
                  <div className="p-3 w-fit bg-zinc-950 rounded-xl text-lime-400 border border-zinc-800">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-white font-heading">{stat.value}</h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{stat.label}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>

        </div>
      </div>
    </section>
  );
};

export default About;
