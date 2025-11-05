import { useState, useEffect } from 'react';
import { empresaService } from '../services/api';
import { useToastContext } from '../context/ToastContext';
import './Empresas.css';

const Empresas = () => {
  const { showSuccess } = useToastContext();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    data_fundacao: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const response = await empresaService.getAll();
      setEmpresas(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setError('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await empresaService.update(editingId, formData);
        showSuccess('Empresa editada com sucesso!');
      } else {
        await empresaService.create(formData);
        showSuccess('Empresa criada com sucesso!');
      }
      await loadEmpresas();
      handleCloseModal();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Erro ao salvar empresa';
      setError(errorMessage);
    }
  };

  const handleEdit = (empresa) => {
    setEditingId(empresa.id);
    setFormData({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco,
      data_fundacao: empresa.data_fundacao,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await empresaService.delete(id);
        await loadEmpresas();
        showSuccess('Empresa excluída com sucesso!');
      } catch (error) {
        setError('Erro ao excluir empresa');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nome: '', cnpj: '', endereco: '', data_fundacao: '' });
    setError('');
  };

  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Empresas</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nova Empresa
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
                <th>CNPJ</th>
                <th>Endereço</th>
                <th>Data de Fundação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Nenhuma empresa cadastrada
                  </td>
                </tr>
              ) : (
                empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td>{empresa.nome}</td>
                    <td>{formatCNPJ(empresa.cnpj)}</td>
                    <td>{empresa.endereco}</td>
                    <td>{formatDate(empresa.data_fundacao)}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(empresa)}
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(empresa.id)}
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
            <h2>{editingId ? 'Editar Empresa' : 'Nova Empresa'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>CNPJ *</label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value.replace(/\D/g, '') })}
                  maxLength={14}
                  required
                  placeholder="00000000000000"
                />
              </div>
              <div className="form-group">
                <label>Endereço *</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Data de Fundação *</label>
                <input
                  type="date"
                  value={formData.data_fundacao}
                  onChange={(e) => setFormData({ ...formData, data_fundacao: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
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

export default Empresas;

