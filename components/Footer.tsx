import React from 'react';
import { Instagram, Youtube, Facebook, Dumbbell } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-10 border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-lime-400" />
            <span className="text-2xl font-heading font-bold text-white tracking-tighter">
              MYFITNESS<span className="text-lime-400">HUB</span>
            </span>
          </div>

          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} MyFitness Hub. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-lime-500 hover:text-black transition-all hover:scale-110">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-red-600 hover:text-white transition-all hover:scale-110">
              <span className="sr-only">Youtube</span>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-blue-600 hover:text-white transition-all hover:scale-110">
              <span className="sr-only">Facebook</span>
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;