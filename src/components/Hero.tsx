import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden bg-[#FBFBFA]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-100/40 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-4 mb-16 opacity-40 justify-center hover:opacity-80 transition-opacity">
              <span className="w-12 h-px bg-[#1A1A1A]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Vol. 2026 • Issue 01</span>
              <span className="w-12 h-px bg-[#1A1A1A]" />
            </div>

            <h1 className="text-7xl md:text-[140px] font-black tracking-[-0.04em] leading-[0.82] mb-16 font-display uppercase italic">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1A1A1A] via-[#333333] to-[#1A1A1A] drop-shadow-sm">
                Democracy
              </span>
              <br />
              <span className="font-normal text-[#1A1A1A]/10 not-italic hover:text-[#1A1A1A]/30 transition-colors duration-700">Defined.</span>
            </h1>

            <div className="grid md:grid-cols-2 gap-12 text-left max-w-5xl border-t border-[#1A1A1A]/10 pt-12 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1A1A1A]/20 to-transparent" />
              <div>
                <p className="text-2xl text-[#1A1A1A] leading-tight font-display italic mb-6">
                  Navigating the complex mechanics of the electoral process with machine-assisted clarity.
                </p>
                <div className="flex gap-4">
                   <button 
                    onClick={() => document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth' })}
                    className="p-4 rounded-full border border-[#1A1A1A]/10 hover:bg-[#1A1A1A] hover:text-white transition-all group hover:shadow-lg hover:shadow-[#1A1A1A]/20 hover:border-transparent"
                  >
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center">Start Interaction</span>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[#1A1A1A]/60 leading-relaxed font-sans">
                  The civic roadmap shouldn't be a maze. We've structured the 2026 election cycle into a scannable, interactive journey. Every voter requirement, every deadline, and every procedure is now accessible via our specialized AI engine.
                </p>
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 border border-white/20 rounded-sm w-fit shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.6)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono text-[#1A1A1A]/80">CivicFlow Processing Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle paper structure lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="h-full w-px bg-black absolute left-1/4" />
        <div className="h-full w-px bg-black absolute left-1/2" />
        <div className="h-full w-px bg-black absolute left-3/4" />
      </div>
    </section>
  );
}
