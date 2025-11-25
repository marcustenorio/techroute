import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState("Carregando...");

  useEffect(() => {
    async function fetchStatus() {
      try {
        const apiUrl = window.RUNTIME_CONFIG.REACT_APP_API_URL;
        console.log("→ Backend API URL:", apiUrl);

        const response = await fetch(`${apiUrl}/status`);
        const data = await response.json();
        setStatus(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Erro backend:", error);
        setStatus("Erro ao conectar ao backend");
      }
    }

    fetchStatus();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>TechRoute Frontend</h1>
      <h3>Status do Backend:</h3>
      <pre>{status}</pre>
    </div>
  );
}

export default App;
