import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Loader2, RotateCcw, FileCheck, Fingerprint, Calendar, ClipboardList, ArrowRight } from 'lucide-react';
import { getElectionAdvice } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await getElectionAdvice(input, messages);
    const aiMessage: Message = { role: 'model', parts: [{ text: responseText }] };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const resetChat = () => {
    setMessages([]);
  };

  return (
    <section id="assistant" className="py-48 bg-[#FBFBFA] relative overflow-hidden border-t border-[#1A1A1A]/5" aria-labelledby="assistant-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-24 items-start">
          <div className="lg:col-span-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono text-[#1A1A1A]/30 mb-8 block">02 / Intelligence Layer</span>
            <h2 id="assistant-heading" className="text-6xl font-black text-[#1A1A1A] tracking-[-0.04em] mb-12 font-display uppercase italic leading-[0.9]">The Lab.</h2>
            <p className="text-[#1A1A1A]/50 text-lg leading-relaxed italic font-display mb-12">
              Our neural engine is trained on official constitutional guidelines and regional procedural mandates.
            </p>
            <div className="p-8 border border-[#1A1A1A]/10 italic text-[#1A1A1A]/30 text-sm font-display">
              Note: AI intelligence is purely educational. Always cross-reference with official state journals.
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col h-[700px] overflow-hidden relative">
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
              
              {/* Header */}
              <div className="px-10 py-6 flex items-center justify-between bg-white/50 backdrop-blur-md z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-[#1A1A1A]/70">CivicFlow Engine Online</span>
                </div>
                <button onClick={resetChat} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-black/5 rounded-full">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent" role="log" aria-live="polite" aria-label="Chat conversation" aria-busy={isLoading}>
                {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center w-full"
                >
                  <div className="w-16 h-16 mx-auto mb-8 bg-emerald-50 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-sm border border-emerald-100">
                    <Bot className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-display font-medium text-[#1A1A1A] mb-12 uppercase italic tracking-tight">
                    Ready when you are.
                  </h3>
                  
                  <div className="space-y-3 w-full">
                    {[
                      { topic: 'Registration Protocol', icon: FileCheck, prompt: 'How do I register to vote in 2026?' },
                      { topic: 'Identity Verification', icon: Fingerprint, prompt: 'What identification is required at polling stations?' },
                      { topic: 'Electoral Timeline', icon: Calendar, prompt: 'Show me the key dates for the upcoming cycle.' },
                      { topic: 'Ballot Mechanics', icon: ClipboardList, prompt: 'How are mail-in ballots verified?' }
                    ].map((item, idx) => (
                      <button 
                        key={item.topic}
                        onClick={() => {
                          setInput(item.prompt);
                          setTimeout(() => handleSend(), 50);
                        }}
                        className="w-full flex items-center gap-6 p-5 bg-white border border-[#1A1A1A]/5 hover:bg-gray-50 hover:border-emerald-200 transition-all duration-300 group text-left rounded-xl shadow-sm hover:shadow-md"
                      >
                        <div className="p-3 bg-gray-50 group-hover:bg-emerald-50 rounded-lg transition-colors">
                          <item.icon className="w-5 h-5 text-[#1A1A1A]/40 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-1 font-mono">{item.topic}</p>
                          <p className="text-[#1A1A1A] font-sans font-medium text-base leading-none group-hover:text-emerald-950 transition-colors">{item.prompt}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-600" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-6 md:p-8 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-[#1A1A1A] to-[#333333] text-white shadow-lg shadow-black/10 rounded-tr-sm font-sans' 
                          : 'bg-white text-[#1A1A1A] border border-gray-100 shadow-sm rounded-tl-sm font-sans text-lg leading-relaxed'
                      }`}>
                        {msg.parts[0].text}
                      </div>
                      <div className={`mt-3 text-[10px] font-black uppercase tracking-widest opacity-30 font-mono flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'user' ? (
                          <><span>Citizen</span><User className="w-3 h-3"/></>
                        ) : (
                          <><Bot className="w-3 h-3 text-emerald-600"/><span>Engine Response</span></>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="p-6 md:p-8 bg-white border border-emerald-100 rounded-2xl rounded-tl-sm shadow-sm inline-block">
                       <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(16,185,129,0.5)] [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce shadow-[0_0_5px_rgba(5,150,105,0.5)] [animation-delay:0.4s]" />
                       </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 md:p-8 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4 relative">
                  <input
                    type="text"
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter query into the roadmap archive..."
                    className="flex-1 bg-gray-50/50 border border-gray-200 rounded-xl px-6 py-5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans text-sm tracking-tight placeholder:italic placeholder:text-gray-400 shadow-inner"
                    aria-label="Type your election question here"
                    aria-describedby="chat-hint"
                    disabled={isLoading}
                  />
                  <p id="chat-hint" className="sr-only">Ask any question about voter registration, election timelines, or polling procedures</p>
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-[#1A1A1A] text-white px-8 rounded-xl transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30 disabled:opacity-20 disabled:hover:bg-[#1A1A1A] disabled:hover:shadow-none flex items-center justify-center gap-2 group"
                    aria-label={isLoading ? 'Sending message, please wait...' : 'Send message to CivicFlow AI'}
                    aria-busy={isLoading}
                  >
                    <span className="text-sm font-bold uppercase tracking-wider hidden md:block">Transmit</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
