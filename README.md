# 🏢 Projeto Plancorp

Aplicação desenvolvida com **Django REST Framework** (backend) e **React** (frontend) para o gerenciamento de **acionistas**, **empresas** e **participações acionárias**.  
O sistema permite o cadastro, edição e exclusão de acionistas e empresas, além do registro de compras de ações entre eles.

---

## 🚀 Tecnologias Utilizadas

### **Frontend:**
- [React](https://react.dev/)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/)

---

## ⚙️ Funcionalidades

- **Dashboard interativo:**  
  Exibe estatísticas gerais das empresas, acionistas e participações em tempo real.  

- **Gestão de empresas:**  
  Permite **criar, editar e excluir** empresas diretamente pela interface.  

- **Gestão de acionistas:**  
  Permite **criar, editar e excluir** acionistas cadastrados.  

- **Registro de participações:**  
  É possível registrar a **compra de ações** por acionistas e acompanhar a **distribuição percentual** de cada empresa.  

- **Visualização de dados em gráficos:**  
  Utiliza **Recharts** para gerar visualizações amigáveis e intuitivas dos dados (como percentual de participações, total de acionistas e distribuição por empresa).  

- **Design responsivo:**  
  A interface foi projetada para se adaptar automaticamente a **qualquer dispositivo**, oferecendo uma navegação fluida tanto em **computadores** quanto em **smartphones**.

---

## 🧠 Integração com o Backend

O frontend consome os endpoints da API Django REST para exibir e manipular os dados de:

- Empresas (`/empresa/empresas/`)
- Acionistas (`/acionista/acionistas/`)
- Participações (`/participacao/participacoes/`)

As requisições são feitas via **Axios**, e os dados retornados alimentam os componentes de listagem, formulários e gráficos interativos.

---

## 💻 Como Executar o Projeto

1. Certifique-se de que o backend (Django) esteja rodando.
2. No terminal, acesse o diretório do frontend:
 ```bash
 cd frontend
 ```
3. Instale as dependências:
```bash
npm install
```
4. Execute o projeto:
```bash
npm run dev
```
