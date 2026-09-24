
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Hexagon, Triangle, CircleDashed } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

// Fix: Cast motion components to any to resolve property 'initial', 'animate', etc. type errors
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.5]);

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100 + 20,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
    color: Math.random() > 0.5 ? 'bg-lime-400' : 'bg-cyan-400'
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <MotionDiv style={{ y: backgroundY, opacity }} className="w-full h-full">
            <MotionDiv initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "linear" }} className="w-full h-full">
                {/* Real generated gym image — local asset */}
                <img 
                src="/images/hero_gym_bg.jpg" 
                alt="MyFitness Hub Gym" 
                className="w-full h-full object-cover opacity-30"
                />
            </MotionDiv>
        </MotionDiv>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40"></div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <MotionDiv animate={{ opacity: 0.1, rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute top-[15%] left-[10%] text-lime-500">
            <Hexagon size={120} strokeWidth={0.5} />
        </MotionDiv>
        {particles.map((p) => (
          <MotionDiv
            key={p.id}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -200, opacity: [0, 0.8, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            className={`absolute rounded-full blur-[1px] shadow-[0_0_10px] ${p.color === 'bg-lime-400' ? 'shadow-lime-500/50' : 'shadow-cyan-500/50'} ${p.color}`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10 relative text-center perspective-1000">
        <MotionDiv variants={containerVariants} initial="hidden" animate="visible" className="transform-style-3d">
          <MotionDiv variants={itemVariants} className="inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-lime-500/30 rounded-full bg-lime-500/10 backdrop-blur-sm mb-6 animate-pulse">
                <Zap className="w-4 h-4 text-lime-400 fill-lime-400" />
                <span className="text-lime-400 text-sm font-bold tracking-wider uppercase">Unleash Your Potential</span>
            </div>
          </MotionDiv>
          
          <MotionH1 variants={itemVariants} className="text-4xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            Transform Your Body.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 neon-text-green inline-block hover:scale-105 transition-transform duration-300">
              Transform Your Life.
            </span>
          </MotionH1>

          <MotionP variants={itemVariants} className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            Elite personal training, advanced strength coaching, and customized nutrition plans designed to push you beyond your limits.
          </MotionP>

          <MotionDiv variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
                onClick={() => onNavigate('signup')}
                className="group relative px-8 py-4 bg-lime-500 text-black font-bold text-lg uppercase tracking-wider skew-x-[-10deg] hover:bg-lime-400 transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(132,204,22,0.4)]"
            >
              <span className="block skew-x-[10deg] flex items-center gap-2">
                Join Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
                onClick={scrollToContact}
                className="group relative px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg uppercase tracking-wider skew-x-[-10deg] hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              <span className="block skew-x-[10deg]">
                Book Free Trial
              </span>
            </button>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
};

export default Hero;
