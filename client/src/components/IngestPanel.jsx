import React, { useState } from 'react';
import { Upload, Link, CheckCircle, AlertCircle, FileText, Globe } from 'lucide-react';
import { api } from '../lib/api';
import clsx from 'clsx';

const IngestPanel = () => {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsLoading(true);
        setStatus({});
        try {
            const res = await api.ingestPDF(file);
            setStatus({ type: 'success', msg: `PDF processado com sucesso. Adicionadas ${res.chunks} partes.` });
            setFile(null);
        } catch (e) {
            setStatus({ type: 'error', msg: e.response?.data?.error || e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlIngest = async () => {
        if (!url) return;
        setIsLoading(true);
        setStatus({});
        try {
            const res = await api.ingestURL(url);
            setStatus({ type: 'success', msg: `URL processado com sucesso. Adicionadas ${res.chunks} partes.` });
            setUrl('');
        } catch (e) {
            setStatus({ type: 'error', msg: e.response?.data?.error || e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Base de Conhecimento</h2>

            <div className="space-y-8">
                {/* PDF Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Carregar PDF do Regulamento / Guia</h3>
                            <p className="text-slate-500">Treina o modelo com documentos e regulamentos de FCT / PAP.</p>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                        <input type="file" id="pdf-upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="text-slate-400" size={32} />
                            <span className="text-slate-600 font-medium">
                                {file ? file.name : "Clica para procurar ou arrasta o ficheiro aqui"}
                            </span>
                        </label>
                    </div>

                    {file && (
                        <button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className="mt-4 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'A processar...' : 'Carregar e Treinar'}
                        </button>
                    )}
                </div>

                {/* URL Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Adicionar Website / Link</h3>
                            <p className="text-slate-500">Extrai informação e aprende a partir de um link público.</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="url"
                            placeholder="https://minhaescola.edu.pt/regulamento-pap"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={handleUrlIngest}
                            disabled={isLoading || !url}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? '...' : 'Adicionar'}
                        </button>
                    </div>
                </div>

                {/* Feedback */}
                {status.msg && (
                    <div className={clsx(
                        "p-4 rounded-xl flex items-center gap-3",
                        status.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{status.msg}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngestPanel;
