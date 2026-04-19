import React, { useState, useRef, useEffect } from 'react';
import { getOllamaService } from '@/services/ollamaService';
import type { ChatMessage } from '@/types';
import { cn } from '@/utils/cn';
import { Send, Bot, Sparkles, AlertCircle, Trash2 } from 'lucide-react';

export default function AICompanionPage() {
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "As-salamu alaykum wa rahmatullahi wa barakatuhu 🌙\n\nI am **Noor AI**, your Islamic study companion. I'm trained on authentic sources from the Quran and Sunnah.\n\nI can help you with:\n• 📖 **Quran Tafsir** - Understand meanings and context\n• 📚 **Hadith Studies** - Explore collections like Bukhari & Muslim\n• 🕌 **Fiqh Questions** - Learn about Islamic jurisprudence\n• 📜 **Islamic History** - Discover stories of the prophets & sahabah\n• 💬 **General Guidance** - Daily reminders and wisdom\n\n*Note: I provide educational information. For specific fatwas, please consult a qualified scholar.*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ollamaService = getOllamaService();
      const responseText = await ollamaService.sendMessage(history, userMsg.text);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, modelMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I apologize, but I encountered a technical issue. Please check your connection and try again. For urgent questions, please consult a qualified scholar.",
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setHistory([
      {
        id: 'welcome',
        role: 'model',
        text: "As-salamu alaykum wa rahmatullahi wa barakatuhu 🌙\n\nI am **Noor AI**, your Islamic study companion. I'm trained on authentic sources from the Quran and Sunnah.\n\nHow may I assist you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-gold-500/20 bg-lapis-800/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {/* Animated Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-lapis-900" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-lapis-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl text-gold-400">Noor AI</h2>
              <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Online • References Quran & Hadith
            </p>
          </div>
        </div>
        
        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {history.map((msg, idx) => (
          <div
            key={msg.id}
            className={cn(
              'flex animate-[fadeIn_0.3s_ease-out]',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className={cn(
                'max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-2xl shadow-md relative',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-lapis-900 rounded-br-lg'
                  : 'bg-lapis-800/80 text-parchment-100 border border-gold-500/20 rounded-bl-lg'
              )}
            >
              {/* Message Content */}
              <div className={cn(
                'font-body text-base leading-relaxed whitespace-pre-wrap break-words',
                msg.role === 'user' ? 'text-lapis-900' : 'text-parchment-100'
              )}>
                {msg.text}
              </div>
              
              {/* Message Footer */}
              <div className={cn(
                'text-[10px] mt-3 pt-2 border-t',
                msg.role === 'user' 
                  ? 'border-lapis-900/20 text-lapis-800/70' 
                  : 'border-gold-500/20 text-slate-500',
                'flex items-center justify-between'
              )}>
                <span className="uppercase tracking-wider">
                  {msg.role === 'user' ? 'You' : 'Noor AI'}
                </span>
                <span>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-lapis-800/80 p-4 rounded-2xl rounded-bl-lg border border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gold-500/20 bg-lapis-800/80 backdrop-blur-xl">
        <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any Islamic topic..."
            className="w-full bg-lapis-900/80 text-parchment-100 border border-gold-500/20 rounded-2xl p-4 pr-14 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 resize-none min-h-[56px] max-h-40 font-body placeholder-slate-500 transition-all"
            rows={1}
            style={{ height: 'auto' }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={cn(
              'absolute right-2 bottom-2 p-3 rounded-xl transition-all duration-300',
              input.trim() && !isLoading
                ? 'bg-gold-500 text-lapis-900 hover:bg-gold-400 hover:scale-105 shadow-lg shadow-gold-500/30'
                : 'bg-lapis-700 text-slate-500 cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Disclaimer */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-slate-500">
          <AlertCircle className="w-3 h-3" />
          <span>AI may make mistakes. Always verify with qualified scholars.</span>
        </div>
      </div>
    </div>
  );
}