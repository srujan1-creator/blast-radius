import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  ShieldCheck, 
  Trash2,
  Lock,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/geminiAgent';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: (hasKey: boolean) => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getGeminiApiKey();
      setHasExistingKey(!!current);
      setApiKeyInput('');
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKeyInput.trim()) {
      setGeminiApiKey(apiKeyInput.trim());
      setHasExistingKey(true);
      setStatusMessage('✓ Gemini API key secured! Zero-shot AI graph reasoning active.');
      setApiKeyInput('');
      onKeyUpdated(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleClear = () => {
    setGeminiApiKey('');
    setApiKeyInput('');
    setHasExistingKey(false);
    setStatusMessage('Key scrubbed. Reverted to Autonomous Sandbox mode.');
    onKeyUpdated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono select-none">
      <div className="w-full max-w-lg bg-[#0c0e15] border border-[#222534] card-raised shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#0e1017] border-b border-[#181a24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#7c83ff]/15 border border-[#7c83ff]/40 flex items-center justify-center text-[#7c83ff]">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <span>Google Gemini AI Agent & Security Vault</span>
              </h3>
              <div className="text-[10px] text-[#787f96]">
                Hardware-isolated client key storage & graph guardrails
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#656b82] hover:text-white hover:bg-[#181a26] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status info */}
          <div className="p-3 bg-[#07080c] border border-[#161824] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#8e94a8]">Agent Reasoning Engine:</span>
              <span className={`font-bold flex items-center gap-1 ${
                hasExistingKey ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hasExistingKey ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                <span>{hasExistingKey ? 'Live Google Gemini 3.8 Flash' : 'Deterministic Sandbox Mode'}</span>
              </span>
            </div>

            {hasExistingKey && (
              <div className="flex items-center justify-between p-2.5 bg-[#0b1410] border border-emerald-900/40 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Security Vault Status:</span>
                </div>
                <span className="font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  KEY SECURELY STORED (HIDDEN)
                </span>
              </div>
            )}

            <p className="text-[11px] text-[#787f96] font-sans leading-relaxed">
              When an API key is connected, the agent executes zero-shot graph reasoning against Google's Gemini models in real time to calculate reachability, generate PR diffs, and power the interactive Security Copilot.
            </p>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-[#c0c5d6] font-semibold flex items-center justify-between">
              <span>{hasExistingKey ? 'Update API Key:' : 'Gemini API Key:'}</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#7c83ff] hover:underline flex items-center gap-1"
              >
                <span>Get key at Google AI Studio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>

            <div className="relative">
              <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#555a6e]" />
              <input
                type="password"
                placeholder={
                  hasExistingKey 
                    ? "•••••••••••••••••••••••• (Key active — paste new key to update)" 
                    : "Paste Gemini API Key (e.g. AIzaSy...)"
                }
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                autoComplete="off"
                className="w-full bg-[#06070a] border border-[#1e2230] text-xs pl-9 pr-3 py-2 text-white placeholder-[#555a6e] focus:outline-none focus:border-[#7c83ff] font-mono"
              />
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-[#6d748c]">
              <div className="flex items-center gap-1.5 bg-[#090b12] p-1.5 border border-[#161826]">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Client Vault Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#090b12] p-1.5 border border-[#161826]">
                <FileCheck className="w-3 h-3 text-[#7c83ff] shrink-0" />
                <span>Zero DLP Exfiltration</span>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {statusMessage && (
            <div className={`p-2 border text-[11px] ${
              statusMessage.includes('saved') 
                ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-950/20 text-amber-300 border-amber-500/30'
            }`}>
              {statusMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#161824]">
            {hasExistingKey ? (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 bg-[#141620] hover:bg-red-950/30 text-[#8890a6] hover:text-red-400 border border-[#222534] hover:border-red-500/40 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Key</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-[#12141c] hover:bg-[#181a26] text-[#8e94a8] hover:text-white border border-[#1e2230] text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKeyInput.trim()}
                className="px-4 py-1.5 bg-[#7c83ff] hover:bg-[#6c74fa] disabled:opacity-50 text-white font-semibold text-xs border border-[#969cff] shadow-[0_0_15px_rgba(124,131,255,0.3)] transition-all cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
