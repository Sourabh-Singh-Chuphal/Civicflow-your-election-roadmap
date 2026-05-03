/**
 * @license SPDX-License-Identifier: Apache-2.0
 * @module App
 * @description Root application component for CivicFlow.
 * Composes all page sections and wraps them with an ErrorBoundary
 * for resilient error handling and Google Cloud Logging integration.
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ElectionTimeline from './components/ElectionTimeline';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * App — Root component for the CivicFlow application.
 * 
 * Structure:
 * - Navbar: Fixed top navigation with section links
 * - Hero: Landing section with animated background and CTA
 * - ElectionTimeline: 6-step sequential election roadmap
 * - AIAssistant: Gemini-powered civic education chat interface
 * - Footer: Site footer with links and attribution
 */
export default function App() {
  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] selection:bg-[#E5E5E0] selection:text-[#1A1A1A] font-sans"
        id="app-root"
      >
        <Navbar />
        <main id="main-content" tabIndex={-1} aria-label="Main content">
          <Hero />
          <ElectionTimeline />
          <AIAssistant />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
