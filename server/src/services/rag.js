const { Ollama } = require("@langchain/community/llms/ollama");
const { OllamaEmbeddings } = require("@langchain/community/embeddings/ollama");
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const fs = require('fs');
const path = require('path');

// Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL_NAME = process.env.OLLAMA_MODEL || "llama2";
const EMBEDDING_MODEL_NAME = process.env.OLLAMA_EMBEDDING_MODEL || MODEL_NAME;
const VECTOR_STORE_PATH = path.join(__dirname, '../../vector_store');

const embeddings = new OllamaEmbeddings({
  baseUrl: OLLAMA_BASE_URL,
  model: EMBEDDING_MODEL_NAME,
});

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
    Tu és um assistente inteligente especializado em FCT (Formação em Contexto de Trabalho: Estágio curricular obrigatório em empresas da área) e PAP (Prova de Aptidão Profissional: Projeto final onde o aluno aplica os conhecimentos adquiridos, apresentado a um júri).
    Usa o seguinte contexto para responder à pergunta no fim. Se a resposta não estiver no contexto, diz que não sabes ou que a informação não consta nos documentos fornecidos, sugerindo que o aluno contacte o seu diretor de curso ou orientador. Responde sempre em português de forma clara e profissional.
    
    Contexto:
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
