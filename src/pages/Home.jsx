import { useState, useEffect } from 'react';
import { participacaoService, acionistaService, empresaService } from '../services/api';
import { useToastContext } from '../context/ToastContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Home.css';

const Home = () => {
  const { showSuccess } = useToastContext();
  const [participacoes, setParticipacoes] = useState([]);
  const [acionistas, setAcionistas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    acionista: '',
    empresa: '',
    percentual: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [participacoesRes, acionistasRes, empresasRes] = await Promise.all([
        participacaoService.getAll(),
        acionistaService.getAll(),
        empresaService.getAll(),
      ]);
      setParticipacoes(participacoesRes.data);
      setAcionistas(acionistasRes.data);
      setEmpresas(empresasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await participacaoService.create({
        acionista: parseInt(formData.acionista),
        empresa: parseInt(formData.empresa),
        percentual: parseFloat(formData.percentual),
      });
      await loadData();
      handleCloseModal();
      showSuccess('Participação criada com sucesso!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Erro ao criar participação';
      setError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ acionista: '', empresa: '', percentual: '' });
    setError('');
  };

  const chartDataPorEmpresa = empresas.map(empresa => {
    const participacoesEmpresa = participacoes.filter(p => p.empresa === empresa.id);
    const totalPercentual = participacoesEmpresa.reduce((sum, p) => sum + parseFloat(p.percentual), 0);
    return {
      nome: empresa.nome,
      percentual: totalPercentual,
      disponivel: 100 - totalPercentual,
    };
  })
  .sort((a, b) => b.percentual - a.percentual)
  .slice(0, 3);

  const chartDataPorAcionista = acionistas.map(acionista => {
    const participacoesAcionista = participacoes.filter(p => p.acionista === acionista.id);
    const totalParticipacoes = participacoesAcionista.length;
    const totalPercentual = participacoesAcionista.reduce((sum, p) => sum + parseFloat(p.percentual), 0);
    return {
      nome: acionista.nome,
      participacoes: totalParticipacoes,
      percentualTotal: totalPercentual,
    };
  })
  .sort((a, b) => b.percentualTotal - a.percentualTotal)
  .slice(0, 3);

  const COLORS = ['#3B82F6', '#FBBF24', '#2563EB', '#F59E0B', '#60A5FA'];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Gestão de Ações</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Comprar Ação
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h2>Participações por Empresa</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataPorEmpresa}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentual" fill="#3B82F6" name="Vendido (%)" />
                  <Bar dataKey="disponivel" fill="#FBBF24" name="Disponível (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Número de Participações por Acionista</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataPorAcionista}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participacoes" fill="#3B82F6" name="Número de Participações" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {(() => {
              const chartDataFiltrado = chartDataPorEmpresa.filter(item => item.percentual > 0);
              return chartDataFiltrado.length > 0 && (
                <div className="chart-card chart-card-pie">
                  <h2>Distribuição de Participações</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartDataFiltrado}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentual"
                      >
                        {chartDataFiltrado.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </div>

          <div className="recent-participacoes">
            <h2>Participações Recentes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Acionista</th>
                    <th>Empresa</th>
                    <th>Percentual</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {participacoes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        Nenhuma participação registrada
                      </td>
                    </tr>
                  ) : (
                    participacoes
                      .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
                      .slice(0, 10)
                      .map((participacao) => (
                        <tr key={participacao.id}>
                          <td>{participacao.acionista_nome}</td>
                          <td>{participacao.empresa_nome}</td>
                          <td>{participacao.percentual}%</td>
                          <td>{new Date(participacao.criado_em).toLocaleDateString('pt-BR')}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Comprar Ação</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Acionista *</label>
                <select
                  value={formData.acionista}
                  onChange={(e) => setFormData({ ...formData, acionista: e.target.value })}
                  required
                >
                  <option value="">Selecione um acionista</option>
                  {acionistas.map((acionista) => (
                    <option key={acionista.id} value={acionista.id}>
                      {acionista.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Empresa *</label>
                <select
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  required
                >
                  <option value="">Selecione uma empresa</option>
                  {empresas.map((empresa) => {
                    const participacoesEmpresa = participacoes.filter(p => p.empresa === empresa.id);
                    const totalPercentual = participacoesEmpresa.reduce((sum, p) => sum + parseFloat(p.percentual), 0);
                    const disponivel = 100 - totalPercentual;
                    return (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome} {disponivel > 0 ? `(${disponivel.toFixed(2)}% disponível)` : '(Indisponível)'}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label>Percentual (%) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="100"
                  value={formData.percentual}
                  onChange={(e) => setFormData({ ...formData, percentual: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Comprar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

