import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Acionistas from './pages/Acionistas';
import Empresas from './pages/Empresas';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acionistas" element={<Acionistas />} />
            <Route path="/empresas" element={<Empresas />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
