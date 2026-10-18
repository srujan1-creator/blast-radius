import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Layers, 
  Activity, 
  Search, 
  Command, 
  Database,
  Radio,
  ExternalLink,
  Zap,
  Play,
  Sparkles,
  Bot,
  Volume2,
  VolumeX
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  onScrollToDemo: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToAgent: () => void;
  onOpenCypherDrawer?: () => void;
  onOpenKeyModal?: () => void;
  hasGeminiKey?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onScrollToDemo, 
  onScrollToHowItWorks,
  onScrollToAgent,
  onOpenCypherDrawer,
  onOpenKeyModal,
  hasGeminiKey
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
    if (sound.enabled) sound.playPing(880);
  };
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090d]/95 backdrop-blur-md border-b border-[#181a24] select-none">
      <div className="max-w-[1520px] mx-auto px-4 h-13 flex items-center justify-between gap-4">
        {/* Brand & Workspace Context */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0f1118] border border-[#2b2f42] flex items-center justify-center text-[#7c83ff] shadow-[0_0_12px_rgba(124,131,255,0.2)]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#7c83ff]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-sm tracking-tight text-white">
                  BLAST RADIUS
                </span>
                <span className="px-1.5 py-0.2 bg-[#171924] text-[#8e94a8] border border-[#26293a] text-[9px] font-mono">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-3 ml-1 border-l border-[#1a1c26] text-xs font-mono">
            <span className="text-[#555a6d]">env:</span>
            <span className="text-[#a5abbf] bg-[#10121a] px-2 py-0.5 border border-[#1e2130]">
              prod-us-east-1
            </span>
          </div>
        </div>

        {/* Center: Quick Search / Command Palette Hint & Engine Status */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg mx-auto">
          {/* Quick Search Bar */}
          <div 
            onClick={onScrollToDemo}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#0e1017] hover:bg-[#13151f] border border-[#1c1f2d] hover:border-[#2f334a] text-xs font-mono text-[#656b82] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3 h-3 text-[#555a6e]" />
              <span className="text-[11px] text-[#787e94]">Search CVE, microservice, or datastore...</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-[#161822] px-1.5 py-0.5 border border-[#222534] text-[#8e94a8]">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Status Indicators & Action CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Synthesizer SFX Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 text-[#6c738c] hover:text-white hover:bg-[#141622] border border-transparent hover:border-[#222534] transition-colors cursor-pointer"
            title={isMuted ? "Enable Tactile SOC Sound FX" : "Mute Sound FX"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#a5adff]" />}
          </button>

          {/* AI Agent Cockpit Direct Navigation Link */}
          <button
            onClick={() => { sound.playClick(); onScrollToAgent(); }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#131626] hover:bg-[#1d2238] border border-[#2e3450] hover:border-[#7c83ff] text-xs font-mono text-[#a5adff] hover:text-white transition-all cursor-pointer shadow-sm group"
          >
            <Bot className="w-3.5 h-3.5 text-[#7c83ff] group-hover:scale-110 transition-transform" />
            <span className="font-semibold">AI Agent Cockpit</span>
          </button>

          {/* Gemini AI Status & Config Pill */}
          <button
            onClick={() => { sound.playClick(); onOpenKeyModal && onOpenKeyModal(); }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121422] hover:bg-[#1a1d30] border border-[#2b2f48] hover:border-[#464c75] text-[11px] font-mono text-[#a5adff] transition-all cursor-pointer group"
            title="Configure Google Gemini AI Agent"
          >
            <Sparkles className="w-3 h-3 text-[#7c83ff] group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-white">Gemini 3.8</span>
            <span className="text-[#4e5473]">|</span>
            <span className={`text-[10px] ${hasGeminiKey ? 'text-emerald-400 font-medium' : 'text-[#8e96bf]'}`}>
              {hasGeminiKey ? 'Live AI' : 'Connect Key'}
            </span>
          </button>

          {/* FalkorDB Runtime Telemetry Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#0b1410] border border-emerald-900/40 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300">FalkorDB v6.8</span>
            <span className="text-emerald-700">|</span>
            <span className="text-[10px] text-emerald-400/80">0.42ms GraphBLAS</span>
          </div>

          <button
            onClick={() => { sound.playClick(); onScrollToHowItWorks(); }}
            className="hidden sm:block text-xs font-mono text-[#8a91a8] hover:text-white px-2 py-1 transition-colors cursor-pointer"
          >
            Architecture
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => { sound.playClick(); onScrollToDemo(); }}
            className="px-3 py-1.5 bg-[#7c83ff] hover:bg-[#6c74fa] text-white text-xs font-mono font-semibold border border-[#969cff] shadow-[0_0_15px_rgba(124,131,255,0.25)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Mission Control</span>
          </button>
        </div>
      </div>
    </header>
  );
};
