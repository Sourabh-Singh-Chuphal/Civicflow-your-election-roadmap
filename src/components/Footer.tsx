import { Vote, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FBFBFA] border-t border-[#1A1A1A]/10 py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 border border-[#1A1A1A]/10 flex items-center justify-center">
                <Vote className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <span className="text-3xl font-black tracking-tight uppercase font-display italic">CivicFlow.</span>
            </div>
            <p className="text-[#1A1A1A]/40 max-w-sm leading-relaxed text-lg italic mb-12 font-display">
              A private digital archive and intelligence suite dedicated to civic enlightenment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-4 border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all">
                <Github size={24} />
              </a>
              <a href="#" className="p-4 border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] font-mono text-[#1A1A1A]/30 mb-8">Navigation</h4>
            <ul className="space-y-6 text-[#1A1A1A] font-display italic text-lg">
              <li><a href="#process" className="hover:opacity-40 transition-opacity underline decoration-1 underline-offset-4 decoration-[#1A1A1A]/10">Roadmap</a></li>
              <li><a href="#assistant" className="hover:opacity-40 transition-opacity underline decoration-1 underline-offset-4 decoration-[#1A1A1A]/10">Intelligence</a></li>
              <li><a href="#" className="hover:opacity-40 transition-opacity underline decoration-1 underline-offset-4 decoration-[#1A1A1A]/10">Archive</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] font-mono text-[#1A1A1A]/30 mb-8">Mandates</h4>
            <ul className="space-y-6 text-[#1A1A1A] font-display italic text-lg">
              <li><a href="https://vote.gov" target="_blank" rel="noopener" className="hover:opacity-40 transition-opacity">Vote.gov</a></li>
              <li><a href="https://eoa.gov" target="_blank" rel="noopener" className="hover:opacity-40 transition-opacity">EAC Main</a></li>
              <li><a href="#" className="hover:opacity-40 transition-opacity">State Portals</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-[#1A1A1A]/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-[#1A1A1A]/20 text-[10px] font-black uppercase tracking-[0.4em] font-mono">
           © MMXXVI CivicFlow Digital Archive
          </p>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] font-mono text-[#1A1A1A]/30">
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Legal Mandates</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
