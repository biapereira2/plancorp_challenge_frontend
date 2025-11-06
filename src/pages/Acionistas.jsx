import { useState, useEffect } from 'react';
import { acionistaService } from '../services/api';
import { useToastContext } from '../context/ToastContext';
import './Acionistas.css';

const Acionistas = () => {
    const { showSuccess } = useToastContext();
    const [acionistas, setAcionistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ nome: '', cpf: '', email: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        loadAcionistas();
    }, []);

    const loadAcionistas = async () => {
        try {
        setLoading(true);
        const response = await acionistaService.getAll();
        setAcionistas(response.data);
        } catch (error) {
        console.error('Erro ao carregar acionistas:', error);
        setError('Erro ao carregar acionistas');
        } finally {
        setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
        if (editingId) {
            await acionistaService.update(editingId, formData);
            showSuccess('Acionista editado com sucesso!');
        } else {
            await acionistaService.create(formData);
            showSuccess('Acionista criado com sucesso!');
        }
        await loadAcionistas();
        handleCloseModal();
        } catch (error) {
        const errorMessage =
            error.response?.data?.error ||
            Object.values(error.response?.data || {}).flat().join(', ') ||
            'Erro ao salvar acionista';
        setError(errorMessage);
        }
    };

    const handleEdit = (acionista) => {
        setEditingId(acionista.id);
        setFormData({
        nome: acionista.nome,
        cpf: acionista.cpf,
        email: acionista.email,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este acionista?')) {
        try {
            await acionistaService.delete(id);
            await loadAcionistas();
            showSuccess('Acionista excluído com sucesso!');
        } catch (error) {
            setError('Erro ao excluir acionista');
        }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ nome: '', cpf: '', email: '' });
        setError('');
    };

    const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="page-container">
        <div className="page-header">
            <h1>Acionistas</h1>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Novo Acionista
            </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
            <div className="loading">Carregando...</div>
        ) : (
            <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>Data de Cadastro</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {acionistas.length === 0 ? (
                    <tr>
                    <td colSpan="5" className="empty-state">
                        Nenhum acionista cadastrado
                    </td>
                    </tr>
                ) : (
                    acionistas.map((acionista) => (
                    <tr key={acionista.id}>
                        <td>{acionista.nome}</td>
                        <td>{formatCPF(acionista.cpf)}</td>
                        <td>{acionista.email}</td>
                        <td>{formatDate(acionista.data_cadastro)}</td>
                        <td>
                        <button
                            className="btn-edit"
                            onClick={() => handleEdit(acionista)}
                            title="Editar"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button
                            className="btn-delete"
                            onClick={() => handleDelete(acionista.id)}
                            title="Excluir"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        )}

        {showModal && (
            <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{editingId ? 'Editar Acionista' : 'Novo Acionista'}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nome *</label>
                    <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                    />
                </div>
                <div className="form-group">
                    <label>CPF *</label>
                    <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        cpf: e.target.value.replace(/\D/g, ''),
                        })
                    }
                    maxLength={11}
                    required
                    placeholder="00000000000"
                    />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    />
                </div>
                <div className="form-actions">
                    <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCloseModal}
                    >
                    Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                    {editingId ? 'Salvar' : 'Criar'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
};

export default Acionistas;
