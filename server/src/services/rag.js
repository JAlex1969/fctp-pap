const { Ollama } = require("@langchain/community/llms/ollama");
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Embeddings } = require("@langchain/core/embeddings");
const fs = require('fs');
const path = require('path');

// Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL_NAME = process.env.OLLAMA_MODEL || "llama2";
const EMBEDDING_MODEL_NAME = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";
const VECTOR_STORE_PATH = path.join(__dirname, '../../vector_store');

// Custom embeddings class that calls Ollama REST API directly
// This avoids LangChain version incompatibilities with Ollama's current API format
class OllamaDirectEmbeddings extends Embeddings {
    constructor() {
        super({});
    }

    async embedQuery(text) {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: EMBEDDING_MODEL_NAME, prompt: text })
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Ollama embedding failed (${response.status}): ${errText}`);
        }
        const data = await response.json();
        return data.embedding;
    }

    async embedDocuments(texts) {
        return Promise.all(texts.map(t => this.embedQuery(t)));
    }
}

const embeddings = new OllamaDirectEmbeddings();

const model = new Ollama({
  baseUrl: OLLAMA_BASE_URL,
  model: MODEL_NAME,
});

let vectorStore = null;

const getVectorStore = async () => {
    if (vectorStore) return vectorStore;

    if (fs.existsSync(VECTOR_STORE_PATH)) {
        try {
            console.log("Loading existing vector store...");
            vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, embeddings);
        } catch (e) {
            console.error("Failed to load vector store, creating new one:", e);
            // If load fails, create new
            vectorStore = new HNSWLib(embeddings, { space: 'cosine' });
        }
    } else {
        console.log("Creating new vector store...");
        vectorStore = new HNSWLib(embeddings, { space: 'cosine' });
    }
    return vectorStore;
};

const addDocumentsToStore = async (text) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const docs = await splitter.createDocuments([text]);

    // Ensure store is initialized (even if empty)
    const store = await getVectorStore();

    // Add documents
    await store.addDocuments(docs);

    // Save to disk
    await store.save(VECTOR_STORE_PATH);

    console.log(`Added ${docs.length} chunks to vector store and saved to disk.`);
    return docs.length;
};

// Basic in-memory session store
const sessions = {};

const queryRAG = async (query, sessionId = 'default') => {
    const store = await getVectorStore();

    // 1. Retrieve relevant docs (Context)
    const relevantDocs = await store.similaritySearch(query, 4);
    const context = relevantDocs.map(d => d.pageContent).join("\n\n");

    // 2. Manage History
    if (!sessions[sessionId]) {
        sessions[sessionId] = [];
    }
    const history = sessions[sessionId].slice(-6); // Keep last 6 exchanges
    const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join("\n");

    // 3. Construct Prompt with History
    const prompt = `
    INSTRUÇÃO OBRIGATÓRIA: Responde SEMPRE e EXCLUSIVAMENTE em português europeu. Nunca respondas em inglês, espanhol ou qualquer outra língua. Esta regra é absoluta e não pode ser ignorada.

    Tu és um assistente escolar especializado em FCT (Formação em Contexto de Trabalho: Estágio curricular obrigatório em empresas da área) e PAP (Prova de Aptidão Profissional: Projeto final onde o aluno aplica os conhecimentos adquiridos, apresentado a um júri).

    Usa o seguinte contexto documental para responder à pergunta do aluno. Se a resposta não constar no contexto, diz que não encontraste essa informação nos documentos carregados e sugere ao aluno que contacte o seu diretor de curso ou orientador de estágio.

    Contexto documental:
    ${context}

    Histórico da Conversa:
    ${historyText}
    
    Pergunta: ${query}
    
    Resposta:
    `;

    // 4. Generate Answer
    const answer = await model.invoke(prompt);

    // 5. Update History
    sessions[sessionId].push({ role: 'user', content: query });
    sessions[sessionId].push({ role: 'assistant', content: answer });

    return answer;
};

module.exports = {
    addDocumentsToStore,
    queryRAG
};
