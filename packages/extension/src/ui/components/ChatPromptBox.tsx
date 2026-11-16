import React, { useState } from 'react';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';

interface ChatPromptBoxProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatPromptBox: React.FC<ChatPromptBoxProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const suggestions = [
    'Summarize this page',
    'Extract all links',
    'Click main CTA',
    'Scroll down',
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="space-y-2">
      {/* Suggestions Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(s)}
            disabled={disabled}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Instruct AI agent to perform any action..."
          disabled={disabled}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition shadow-inner font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition"
          title="Dispatch command"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
