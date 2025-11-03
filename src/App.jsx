import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/acionista/hello/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Erro ao buscar API:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontSize: "1.5rem" }}>
      <h1>{message || "Carregando..."}</h1>
    </div>
  );
}


export default App
