import React, { useState } from 'react';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

interface ChatPromptBoxProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatPromptBox: React.FC<ChatPromptBoxProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const suggestions = [
    'Summarize page',
    'Extract all links',
    'Click main CTA',
    'Scroll to footer',
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <section className="bg-[#0e1015] border border-[#232834] rounded-lg p-2.5 space-y-2">
      {/* Input Field with keycap badge */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Instruct AI agent to perform any browser action..."
          disabled={disabled}
          className="w-full bg-[#08090b] border border-[#232834] focus:border-[#6366f1] focus:ring-0 text-[#e3e2e5] text-xs font-mono rounded pl-2.5 pr-16 py-2 transition-colors placeholder:text-[#484f63] outline-none"
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          <span className="bg-[#14171f] text-[#7a8296] font-mono text-[9px] px-1 py-0.5 rounded border border-[#232834]">
            ⌘⏎
          </span>
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="w-6 h-6 rounded bg-[#6366f1] text-white flex items-center justify-center hover:bg-[#4f46e5] disabled:opacity-40 transition-colors"
            title="Dispatch browser action"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 no-scrollbar text-[11px]">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(s)}
            disabled={disabled}
            className="bg-[#14171f] border border-[#232834] hover:border-[#3b4354] text-[#7a8296] hover:text-[#f4f4f6] px-2 py-0.5 rounded-full font-mono text-[10px] whitespace-nowrap transition-colors flex-shrink-0"
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );
};
