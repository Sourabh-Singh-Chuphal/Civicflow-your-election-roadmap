import { motion } from 'motion/react';
import { ELECTION_STEPS } from '../constants';
import * as LucideIcons from 'lucide-react';

const IconWrapper = ({ name }: { name: string }) => {
  const formatName = (str: string) => {
    return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  };
  const iconName = formatName(name) as keyof typeof LucideIcons;
  const Icon = (LucideIcons[iconName] || LucideIcons.CircleHelp) as LucideIcons.LucideIcon;
  return <Icon className="w-5 h-5" />;
};

export default function ElectionTimeline() {
  return (
    <section id="process" className="py-48 bg-white border-t border-[#1A1A1A]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono text-[#1A1A1A]/30 mb-6 block">01 / Sequential Roadmap</span>
            <h2 className="text-6xl md:text-8xl font-black text-[#1A1A1A] tracking-[-0.04em] font-display uppercase italic leading-none">The Path.</h2>
          </div>
          <p className="text-[#1A1A1A]/70 max-w-sm text-lg leading-relaxed italic font-display">
            Democracy is a sequence. A series of intentional steps that ensure your voice is heard and verified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
          {ELECTION_STEPS.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-12 bg-white relative group min-h-[440px] flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:bg-gradient-to-br hover:from-white hover:to-[#FBFBFA] z-10 hover:z-20"
            >
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/10 transition-colors pointer-events-none" />
              <div className="flex justify-between items-start mb-16 relative z-10">
                <span className="text-9xl font-black font-display opacity-[0.03] absolute -top-8 -left-6 pointer-events-none group-hover:opacity-[0.08] group-hover:text-emerald-900 transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                  {index + 1}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono transition-all px-3 py-1 border shadow-sm ${
                  step.status === 'completed' ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50 shadow-emerald-100/50' :
                  step.status === 'current' ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-[#1A1A1A]/20' :
                  'border-[#1A1A1A]/10 text-[#1A1A1A]/30 bg-white group-hover:border-[#1A1A1A]/20'
                }`}>
                  {step.status}
                </span>
                <div className="opacity-20 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-500 transform group-hover:scale-110">
                  <IconWrapper name={step.icon} />
                </div>
              </div>
              
              <div className="mt-auto relative z-10">
                <h3 className="text-4xl font-black text-[#1A1A1A] mb-6 font-display tracking-tight uppercase leading-none italic group-hover:text-emerald-950 transition-colors">{step.title}</h3>
                <p className="text-[#1A1A1A]/70 leading-relaxed italic font-display text-lg pr-4">{step.description}</p>
              </div>

              {step.status === 'current' && (
                <div className="absolute bottom-12 right-12 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 absolute animate-ping" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 relative z-10 shadow-[0_0_8px_rgba(5,150,105,0.8)]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
