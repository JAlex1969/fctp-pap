import React, { useState } from 'react';
import LandingOne from './components/LandingOne';
import ChatInterface from './components/ChatInterface';
import IngestPanel from './components/IngestPanel';

function App() {
  const [view, setView] = useState('landing'); // landing, chat, start

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o teu assistente para a FCT (Formação em Contexto de Trabalho) e PAP (Prova de Aptidão Profissional). Como posso ajudar-te hoje?' }
  ]);
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <span className="text-2xl font-bold text-railroad-900">FCT / PAP Bot</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setView('ingest')}
            className="text-sm font-medium text-slate-500 hover:text-railroad-600 transition-colors"
          >
            Base de Conhecimento
          </button>
          <button
            onClick={() => setView('chat')}
            className="px-4 py-2 bg-railroad-900 text-white rounded-lg text-sm font-semibold hover:bg-railroad-800 transition-colors shadow-lg shadow-railroad-900/20"
          >
            Abrir Chat
          </button>
        </div>
      </nav>

      <main className="">
        {view === 'landing' && <LandingOne onStart={() => setView('chat')} />}
        {view === 'chat' && (
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
            sessionId={sessionId}
          />
        )}
        {view === 'ingest' && <IngestPanel />}
      </main>
    </div>
  );
}

export default App;
