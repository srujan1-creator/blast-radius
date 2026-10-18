import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Dashboard } from './components/Dashboard/Dashboard';
import { HowItWorks } from './components/HowItWorks';
import { KeyFocus } from './components/KeyFocus';
import { ComparisonTable } from './components/ComparisonTable';
import { Footer } from './components/Footer';
import { GeminiAgentCommandCenter } from './components/AIAgent/GeminiAgentCommandCenter';
import { GeminiKeyModal } from './components/GeminiKeyModal';
import { getGeminiApiKey } from './services/geminiAgent';
import { INITIAL_GRAPH_DATA, SECURITY_FINDINGS } from './data/mockData';

export function App() {
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(() => !!getGeminiApiKey());

  const scrollToDemo = () => {
    const el = document.getElementById('live-dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAgent = () => {
    const el = document.getElementById('ai-agent-center');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#e2e4ec] selection:bg-[#7c83ff]/30 selection:text-white flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        onScrollToDemo={scrollToDemo}
        onScrollToHowItWorks={scrollToHowItWorks}
        onScrollToAgent={scrollToAgent}
        onOpenKeyModal={() => setIsGeminiModalOpen(true)}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        {/* Section 1: Hero Section */}
        <HeroSection
          onScrollToDemo={scrollToDemo}
          onScrollToHowItWorks={scrollToHowItWorks}
          onScrollToAgent={scrollToAgent}
        />

        {/* Section 2 & 3: Live Dashboard & Explainability Card */}
        <Dashboard
          graphData={INITIAL_GRAPH_DATA}
          findings={SECURITY_FINDINGS}
          onOpenKeyModal={() => setIsGeminiModalOpen(true)}
        />

        {/* Dedicated Section: Autonomous Gemini AI Agent Command Center */}
        <GeminiAgentCommandCenter
          graphData={INITIAL_GRAPH_DATA}
          findings={SECURITY_FINDINGS}
          onOpenKeyModal={() => setIsGeminiModalOpen(true)}
        />

        {/* Section 4: How It Works */}
        <HowItWorks />

        {/* Section 5: Key Focus Capabilities */}
        <KeyFocus />

        {/* Section 6: Traditional Scanners vs. Blast Radius Comparison */}
        <ComparisonTable />
      </main>

      {/* Section 7: Footer */}
      <Footer onScrollToTop={scrollToTop} />

      {/* Gemini AI Agent Configuration Modal */}
      <GeminiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onKeyUpdated={(hasKey) => setHasGeminiKey(hasKey)}
      />
    </div>
  );
}

export default App;
