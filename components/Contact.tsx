import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Loader2, CheckCircle, AlertCircle, Send, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = 'Minimum 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email';
      isValid = false;
    }

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
       errors.phone = 'Enter valid phone number';
       isValid = false;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      errors.message = 'Minimum 10 characters required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
          }]);
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          
          <div>
            <div className="inline-flex items-center gap-2 text-lime-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4">
                <div className="w-10 h-0.5 bg-lime-500"></div>
                Communication Uplink
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 uppercase tracking-tighter">
                Start Your <span className="text-lime-400">Journey</span>
            </h2>
            <p className="text-zinc-500 mb-10 max-w-lg text-base md:text-lg">
                Ready to crush your goals? Send us a brief or visit the hub today. First tactical consultation is complimentary.
            </p>

            {status === 'success' && (
              <div className="mb-6 bg-lime-500/10 border border-lime-500/50 p-4 rounded-2xl flex items-center gap-3 text-lime-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-bold uppercase tracking-widest">Message received! Dispatching coach response...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    placeholder="FULL NAME" 
                    className={`w-full bg-zinc-900 border rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none transition-all ${
                      fieldErrors.name ? 'border-red-500' : 'border-zinc-800 focus:border-lime-400'
                    }`}
                  />
                  {fieldErrors.name && <p className="text-red-400 text-[10px] mt-1.5 font-bold uppercase ml-2">{fieldErrors.name}</p>}
                </div>
                <div>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel" 
                    placeholder="PHONE NUMBER" 
                    className={`w-full bg-zinc-900 border rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none transition-all ${
                      fieldErrors.phone ? 'border-red-500' : 'border-zinc-800 focus:border-lime-400'
                    }`}
                  />
                  {fieldErrors.phone && <p className="text-red-400 text-[10px] mt-1.5 font-bold uppercase ml-2">{fieldErrors.phone}</p>}
                </div>
              </div>
              <div>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className={`w-full bg-zinc-900 border rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none transition-all ${
                      fieldErrors.email ? 'border-red-500' : 'border-zinc-800 focus:border-lime-400'
                    }`}
                />
                {fieldErrors.email && <p className="text-red-400 text-[10px] mt-1.5 font-bold uppercase ml-2">{fieldErrors.email}</p>}
              </div>
              <div>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  placeholder="WHAT ARE YOUR OBJECTIVES?" 
                  className={`w-full bg-zinc-900 border rounded-2xl p-4 text-white placeholder-zinc-700 focus:outline-none transition-all resize-none ${
                      fieldErrors.message ? 'border-red-500' : 'border-zinc-800 focus:border-lime-400'
                    }`}
                ></textarea>
                {fieldErrors.message && <p className="text-red-400 text-[10px] mt-1.5 font-bold uppercase ml-2">{fieldErrors.message}</p>}
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl tracking-[0.2em] hover:bg-lime-500 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>TRANSMIT <Send className="w-4 h-4" /></>}
              </button>
            </form>

            <a 
              href="https://wa.me/919677355463?text=Hi%2C%20I%20want%20to%20know%20more%20about%20MyFitness%20Hub." 
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-black uppercase py-5 rounded-2xl tracking-[0.2em] hover:brightness-110 shadow-lg"
            >
              <MessageCircle className="w-6 h-6" /> WHATSAPP DIRECT
            </a>
          </div>

          <div className="space-y-6 md:space-y-8 lg:pt-16">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
                <div className="flex items-start gap-4 bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800">
                  <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-400 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">Base Headquarters</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      123, Street Salem,<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800">
                   <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">Direct Uplink</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      +91 9677355463<br />
                      info@myfitnesshub.fit
                    </p>
                  </div>
                </div>
             </div>

             <div className="w-full h-[250px] md:h-[350px] bg-zinc-900 border border-zinc-800 flex items-center justify-center relative group overflow-hidden rounded-3xl shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15632.138833918503!2d78.11874222684846!3d11.622544256860015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf1cc59fd3949%3A0xc33ad88437dec3f!2sSalem%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1622222222222!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border:0, filter: 'grayscale(100%) invert(92%) contrast(83%) brightness(0.7)'}} 
                  allowFullScreen={false} 
                  loading="lazy"
                  className="absolute inset-0 grayscale contrast-125 invert brightness-75 group-hover:brightness-90 group-hover:scale-110 transition-all duration-700"
                ></iframe>
                <div className="absolute bottom-4 left-4 z-10 bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <Globe className="w-3 h-3 text-lime-400" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Global Coordinates</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;