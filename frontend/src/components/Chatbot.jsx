import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = 'AIzaSyDG8rZGpHOuas17I1jgkPEiqwMcBAt3Hss';
const genAI = new GoogleGenerativeAI(API_KEY);

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello! I am your AgriStoreSmart Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Using gemini-2.5-flash as requested
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: "You are the AgriStoreSmart Assistant, an AI expert in post-harvest warehouse management, cold storage logistics, and agricultural supply chain technology. Be concise, professional, and helpful."
            });

            // Format history for Gemini (excluding the first initial greeting if it's the only one, or ensuring proper user/model alternating)
            // Gemini strictly requires history to start with user, OR we can just pass the previous messages excluding the hardcoded greeting
            const apiHistory = messages
                .filter((_, index) => index > 0) // Skip the hardcoded first greeting
                .map(msg => ({
                    role: msg.role === 'model' ? 'model' : 'user',
                    parts: [{ text: msg.text }]
                }));

            const chat = model.startChat({
                history: apiHistory
            });

            const result = await chat.sendMessage(userMessage);
            const responseText = result.response.text();

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to Gemini. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] bg-[#0B130E] border border-white/10 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden animate-slide-up transform origin-bottom-right pointer-events-auto">
                    {/* Header */}
                    <div className="bg-[#040D06] border-b border-white/10 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-1.5 rounded-lg text-sm">eco</span>
                            <span className="font-serif font-bold text-zinc-300">AgriStore<span className="text-amber-500">Assistant</span></span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans no-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-sm'
                                    : 'bg-[#040D06] border border-white/5 text-zinc-300 rounded-tl-sm font-light'
                                    }`} style={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#040D06] border border-white/5 rounded-2xl px-4 py-3 rounded-tl-sm flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-[#040D06] border-t border-white/10">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about crop storage, logistics..."
                                className="w-full bg-[#0B130E] border border-white/10 focus:border-amber-500 rounded-xl pl-4 pr-12 py-3 outline-none focus:ring-1 focus:ring-amber-500/20 text-white placeholder:text-zinc-600 text-sm font-light transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2.5 text-amber-500 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed p-1.5 flex items-center justify-center transition-colors bg-amber-500/10 hover:bg-amber-500/20 rounded-lg"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center transition-transform hover:scale-105 pointer-events-auto cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[28px]">chat</span>
                </button>
            )}
        </div>
    );
}
