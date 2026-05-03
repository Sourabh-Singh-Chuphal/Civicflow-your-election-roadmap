/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ElectionTimeline from './components/ElectionTimeline';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] selection:bg-[#E5E5E0] selection:text-[#1A1A1A] font-sans">
      <Navbar />
      <main>
        <Hero />
        <ElectionTimeline />
        <AIAssistant />
      </main>
      <Footer />
    </div>
  );
}

