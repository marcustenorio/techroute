import React, { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Carregando...");

  useEffect(() => {
    async function fetchStatus() {
      try {
        const API_URL = window._env_?.REACT_APP_API_URL;

        if (!API_URL) {
          setStatus("API_URL não carregada (env.js vazio)");
          return;
        }

        console.log("API_URL runtime:", API_URL);

        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        setStatus(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Erro fetch:", err);
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
