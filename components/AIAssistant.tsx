import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, LogOut } from 'lucide-react';
import { useLayout } from './LayoutProvider';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { THEMES } from '../constants';

const AIAssistant: React.FC = () => {
  const { theme, translate } = useLayout();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    geminiService.initChat();
    // Add initial welcome message
    setMessages([{
      id: 'init',
      role: 'model',
      text: 'Hello! I am your AI IT Assistant. How can I help you with your studies today?',
      timestamp: Date.now()
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await geminiService.sendMessage(userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const themeColors = THEMES[theme];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-transform hover:scale-110 ${themeColors.primary} text-white animate-bounce`}
          aria-label="Open AI Assistant"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-96 h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden ${themeColors.card} ${theme === 'dark' ? 'border border-gray-700' : ''}`}>
          
          {/* Header */}
          <div className={`${themeColors.primary} p-4 flex justify-between items-center text-white`}>
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-bold">{translate('aiAssistant')}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-opacity-50" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? `${themeColors.primary} text-white rounded-br-none` 
                    : `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-bl-none`
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} animate-pulse`}>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={translate('chatPlaceholder')}
                className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' 
                    : 'bg-white border-gray-300 focus:ring-indigo-300'
                }`}
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className={`p-2 rounded-lg ${themeColors.primary} text-white disabled:opacity-50 hover:opacity-90 transition`}
              >
                <Send size={20} />
              </button>
            </div>
             <div className="mt-2 text-center">
                 <button 
                   onClick={() => setIsOpen(false)}
                   className="text-xs text-red-500 hover:text-red-700 hover:underline"
                 >
                   Exit Chat
                 </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;