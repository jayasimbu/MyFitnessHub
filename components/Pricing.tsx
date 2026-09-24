
import React from 'react';
import { motion } from 'framer-motion';
import { PricingPlan } from '../types';
import { Check } from 'lucide-react';

const plans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹699',
    period: '/mo',
    features: ['Gym Access', 'Locker Room', 'Free Wifi', 'General Trainer'],
    isPopular: false,
  },
  {
    id: 'half-yearly',
    name: '6 Months',
    price: '₹3,999',
    period: '/6mo',
    features: ['All Monthly Perks', 'Diet Consultation', 'Steam Bath Access', 'Guest Pass (x2)'],
    isPopular: true,
  },
  {
    id: 'yearly',
    name: '12 Months',
    price: '₹7,999',
    period: '/yr',
    features: ['All 6-Month Perks', 'Personal Training (x5)', 'Free Merch Pack', 'Priority Support'],
    isPopular: false,
  },
];

interface PricingProps {
  onSelectPlan?: (plan: PricingPlan) => void;
}

// Fix: Cast motion.div to any to resolve type errors
const MotionDiv = motion.div as any;

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Membership <span className="text-cyan-400">Plans</span>
          </h2>
          <p className="text-zinc-400">Invest in yourself. Affordable plans for everyone.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, idx) => (
            <MotionDiv
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 border-2 flex flex-col ${
                plan.isPopular 
                  ? 'bg-zinc-950 border-lime-500 shadow-[0_0_30px_rgba(132,204,22,0.15)] z-10 md:-mt-8 md:mb-8' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              } transition-all duration-300`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lime-500 text-black font-bold uppercase text-sm px-4 py-1 tracking-wider shadow-lg">
                  Best Value
                </div>
              )}

              <h3 className="text-2xl font-heading font-bold text-white mb-2 text-center">{plan.name}</h3>
              <div className="text-center mb-8">
                <span className={`text-4xl font-bold ${plan.isPopular ? 'text-lime-400' : 'text-white'}`}>{plan.price}</span>
                <span className="text-zinc-500 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Check className={`w-5 h-5 ${plan.isPopular ? 'text-lime-400' : 'text-zinc-500'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Bug Fix: Button said "Choose Plan" for all 3 — tests can now target by plan name */}
              <button 
                onClick={() => onSelectPlan && onSelectPlan(plan)}
                id={`select-plan-${plan.id}`}
                className={`w-full py-3 font-bold uppercase tracking-widest transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-lime-500 text-black hover:bg-lime-400 hover:scale-105'
                    : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                Select {plan.name}
              </button>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
