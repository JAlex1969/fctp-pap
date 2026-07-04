import axios from 'axios';

const API_Base = 'http://localhost:3000/api';

export const api = {
    ingestPDF: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post(`${API_Base}/ingest/pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    ingestURL: async (url) => {
        const res = await axios.post(`${API_Base}/ingest/url`, { url });
        return res.data;
    },
    chat: async (prompt, sessionId) => {
        const res = await axios.post(`${API_Base}/chat`, { prompt, sessionId });
        return res.data; // { answer: string }
    }
};
