
import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '../types';
import { Dumbbell, Activity, Monitor, Flame } from 'lucide-react';

const services: Service[] = [
  {
    id: '1',
    title: 'Personal Training',
    description: '1-on-1 coaching tailored specifically to your body type and goals. We push you past your limits safely.',
    icon: Dumbbell,
  },
  {
    id: '2',
    title: 'Weight Loss Program',
    description: 'High-intensity interval training combined with nutritional guidance to shed fat and reveal muscle.',
    icon: Flame,
  },
  {
    id: '3',
    title: 'Strength & Conditioning',
    description: 'Advanced lifting techniques focused on power, hypertrophy, and functional strength for athletes.',
    icon: Activity,
  },
  {
    id: '4',
    title: 'Online Coaching',
    description: 'Get our expert programming and weekly check-ins from anywhere in the world via our dedicated app.',
    icon: Monitor,
  },
];

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Our <span className="text-lime-400">Expertise</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Comprehensive fitness solutions designed to maximize your potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <MotionDiv
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-zinc-950 p-8 border border-zinc-800 hover:border-lime-400 transition-colors duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <service.icon className="w-24 h-24 text-lime-400" />
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 group-hover:bg-lime-500 group-hover:text-black transition-colors duration-300 text-lime-400">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-3 group-hover:text-lime-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
