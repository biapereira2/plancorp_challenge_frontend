import { Link, useLocation } from 'react-router-dom';
import { useToastContext } from '../context/ToastContext';
import ToastContainer from './ToastContainer';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-container">
            <img src="/logo.svg" alt="PlanCorp" className="logo-icon" />
            <h1 className="logo">Desafio PlanCorp</h1>
          </div>
          <div className="nav-links">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Ações
            </Link>
            <Link 
              to="/acionistas" 
              className={location.pathname === '/acionistas' ? 'active' : ''}
            >
              Acionistas
            </Link>
            <Link 
              to="/empresas" 
              className={location.pathname === '/empresas' ? 'active' : ''}
            >
              Empresas
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Layout;

