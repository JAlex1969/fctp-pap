import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, BookOpen, Zap, Shield, ChevronRight } from 'lucide-react';

const LandingOne = ({ onStart }) => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)]">
            <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-slate-900 text-white">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-6 text-railroad-500 font-medium tracking-widest uppercase">
                            <GraduationCap size={24} />
                            <span>Orientador Escolar Digital</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Sucesso na tua <span className="text-transparent bg-clip-text bg-gradient-to-r from-railroad-400 to-cyan-300">FCT & PAP</span> <br/> 
                            ao teu alcance
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            Esclarece as tuas dúvidas sobre o Estágio curricular (FCT) e a Prova de Aptidão Profissional (PAP). 
                            Carrega os regulamentos da tua escola e obtém respostas instantâneas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={onStart}
                                className="group px-8 py-4 bg-railroad-500 text-white rounded-full font-bold text-lg hover:bg-railroad-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center gap-2"
                            >
                                Começar a Conversar
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={onStart}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                            >
                                Saber Mais
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Briefcase, title: "FCT (Estágio)", desc: "Tudo sobre a Formação em Contexto de Trabalho: estágio obrigatório em empresas parceiras para ganhares experiência real." },
                        { icon: GraduationCap, title: "PAP (Projeto Final)", desc: "Prepara a tua Prova de Aptidão Profissional: o projeto prático final que demonstra tudo o que aprendeste perante o júri." },
                        { icon: BookOpen, title: "Regulamento e Guias", desc: "Respostas precisas e personalizadas com base nos critérios, modelos de relatórios e documentação da tua escola." }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-railroad-100 text-railroad-600 rounded-xl flex items-center justify-center mb-6">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingOne;
