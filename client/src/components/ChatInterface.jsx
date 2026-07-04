import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import clsx from 'clsx';

const ChatInterface = ({ messages, setMessages, sessionId }) => {
    // State lifted to App.jsx
    // const [messages, setMessages] = useState([...]);
    // const [sessionId] = useState(...)

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await api.chat(userMsg.content, sessionId);
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error connecting to the server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-railroad-600 rounded-full flex items-center justify-center text-white">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">Orientador de FCT & PAP</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-slate-500 font-medium">Online • Conhecimento Ativo</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={clsx(
                                    "flex gap-4 max-w-[80%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                                    msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-railroad-100 text-railroad-600"
                                )}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={clsx(
                                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-railroad-600 text-white rounded-tr-none"
                                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-railroad-100 text-railroad-600 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-railroad-500" />
                                <span className="text-sm text-slate-500">A pensar...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunta sobre datas, relatórios, regulamento da PAP..."
                            className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border border-transparent focus:border-railroad-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-railroad-500/10 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3.5 bg-railroad-600 text-white rounded-xl hover:bg-railroad-500 disabled:opacity-50 disabled:hover:bg-railroad-600 transition-colors shadow-lg shadow-railroad-600/20"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <div className="text-center mt-2 text-xs text-slate-400">
                        A IA pode cometer erros. Confirma sempre com o teu orientador de FCT/PAP.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
