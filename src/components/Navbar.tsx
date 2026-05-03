import { Vote, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#1A1A1A]/5" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center p-2">
              <Vote className="w-full h-full text-[#1A1A1A]" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase font-display">Civic<span className="italic font-normal opacity-40">Flow</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60" role="menubar">
            <a href="#process" className="hover:text-[#1A1A1A] transition-colors" role="menuitem" aria-label="Navigate to election roadmap section">Roadmap</a>
            <a href="#assistant" className="hover:text-[#1A1A1A] transition-colors" role="menuitem" aria-label="Navigate to AI intelligence section">AI Intelligence</a>
            <a href="https://vote.gov" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A] transition-colors" role="menuitem" aria-label="Visit vote.gov - external resource (opens in new tab)">Resources</a>
            <button 
              onClick={() => document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#1A1A1A] text-white px-8 py-3 hover:bg-[#333] transition-all font-sans font-bold text-[10px] uppercase tracking-widest"
              aria-label="Consult AI assistant - scroll to chat section"
            >
              Consult AI
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#1A1A1A] p-2" aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen} aria-controls="mobile-menu">
              {isOpen ? <X className="w-7 h-7" aria-hidden="true" /> : <Menu className="w-7 h-7" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#FBFBFA] border-b border-[#1A1A1A]/10 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-12 space-y-8 text-[11px] font-bold uppercase tracking-[0.2em]">
              <a href="#process" onClick={() => setIsOpen(false)} className="block text-xl">Roadmap</a>
              <a href="#assistant" onClick={() => setIsOpen(false)} className="block text-xl">AI Intelligence</a>
              <button className="w-full bg-[#1A1A1A] text-white py-5 text-sm uppercase tracking-[0.2em]">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
