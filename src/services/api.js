import axios from 'axios';

const api = axios.create({
    baseURL: 'https://plancorp-challenge-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Serviços de Acionistas
export const acionistaService = {
    getAll: () => api.get('/acionista/acionistas/'),
    getById: (id) => api.get(`/acionista/acionistas/${id}/`),
    create: (data) => api.post('/acionista/acionistas/', data),
    update: (id, data) => api.put(`/acionista/acionistas/${id}/`, data),
    delete: (id) => api.delete(`/acionista/acionistas/${id}/`),
};

// Serviços de Empresas
export const empresaService = {
    getAll: () => api.get('/empresa/empresas/'),
    getById: (id) => api.get(`/empresa/empresas/${id}/`),
    create: (data) => api.post('/empresa/empresas/', data),
    update: (id, data) => api.put(`/empresa/empresas/${id}/`, data),
    delete: (id) => api.delete(`/empresa/empresas/${id}/`),
};

// Serviços de Participações (Ações)
export const participacaoService = {
    getAll: () => api.get('/participacao/participacoes/'),
    getById: (id) => api.get(`/participacao/participacoes/${id}/`),
    create: (data) => api.post('/participacao/participacoes/', data),
    update: (id, data) => api.put(`/participacao/participacoes/${id}/`, data),
    delete: (id) => api.delete(`/participacao/participacoes/${id}/`),
};

export default api;

