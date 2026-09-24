
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Fix: Cast motion components to any to resolve type errors
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const GymBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Vanakkam! I am HubBot 🤖. Your personal assistant for MyFitness Hub Salem. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Edge function is stateless, no session to initialize here
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    
    // Create new messages array including the new user message
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
        const systemInstruction = `
            You are HubBot, the advanced AI backend and assistant for 'MyFitness Hub' in Salem, Tamil Nadu.
            
            === BACKEND DATABASE (TRAINING DATA) ===
            
            1. **IDENTITY & TONE**
               - Name: HubBot.
               - Tone: Energetic, polite, professional. Use Tamil-English (Tanglish) if appropriate but mostly English.
               - Location: 123, Street salem, TamilNadu.
            
            2. **MEMBERSHIP PRICING (INDIA)**
               - Monthly: ₹1,999/mo + ₹500 initiation fee.
               - Quarterly: ₹4,999/3mo (Save ₹1000).
               - Annual: ₹14,999/yr. Includes 5 Personal Training sessions.
               - Day Pass: ₹500.
            
            3. **FACILITIES**
               - Equipment from Rogue and Technogym. 24/7 Floor access.
               - Recovery: Sauna, Steam Room, and Juice Bar.
            
            4. **OPERATING HOURS**
               - Gym: 24/7 for members.
               - Staffed: 6:00 AM - 10:00 PM.
            
            5. **EXERCISE ADVICE**
               - Squat, Bench, Deadlift, Plank cues.
               - Focus on form and consistency.

            === INSTRUCTIONS ===
            - Always identify as 'MyFitness Hub' staff.
            - Keep responses concise.
            - Encourage users to visit the Salem branch for a free trial.
        `;

        // Bug Fix: Sending full history causes token overflow on long chats.
        // Cap to last 10 messages to stay within Gemini's context window.
        const recentMessages = newMessages.slice(-10);
        const historyPrompt = recentMessages.map(m => `${m.role === 'user' ? 'User' : 'HubBot'}: ${m.text}`).join('\n');
        const prompt = `${systemInstruction}\n\n=== CONVERSATION HISTORY ===\n${historyPrompt}\n\nHubBot:`;

        const { data, error } = await supabase.functions.invoke('gemini', {
            body: { prompt }
        });

        if (error) throw error;

        setMessages(prev => [...prev, { role: 'model', text: data.text || "I'm having trouble connecting to my brain. Try again!" }]);
    } catch (error) {
        console.error("Bot Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again later." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <MotionButton
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(132,204,22,0.6)] transition-colors ${isOpen ? 'hidden' : 'bg-gradient-to-r from-lime-500 to-lime-400 text-black'}`}
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-lime-500 opacity-20"></div>
        <MessageCircle className="w-8 h-8 relative z-10" />
      </MotionButton>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] h-[550px] bg-zinc-950/95 backdrop-blur-xl border border-lime-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lime-500 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="font-heading font-bold text-white text-sm">MyFitness Hub AI</h3>
                        <p className="text-[10px] text-lime-400 font-bold uppercase">Salem Branch</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`p-3 rounded-xl max-w-[85%] text-sm ${
                            msg.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                />
                <button type="submit" disabled={isLoading} className="bg-lime-500 p-2 rounded-lg text-black hover:bg-lime-400 transition-colors">
                    <Send className="w-5 h-5" />
                </button>
            </form>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default GymBot;
