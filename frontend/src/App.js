import React, { useState } from "react";
import AgendamentoForm from "./components/AgendamentoForm";

export default function App() {
  const [ultimoAgendamento, setUltimoAgendamento] = useState(null);

  function atualizarUltimo(dados) {
    setUltimoAgendamento(dados);
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        TechRoute – Agendamentos
      </h1>

      <AgendamentoForm onCreated={atualizarUltimo} />

      {ultimoAgendamento && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#0b1220",
            borderRadius: "10px",
            border: "1px solid #1e293b",
            color: "#e2e8f0",
            maxWidth: "720px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h3>Último Agendamento Criado:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(ultimoAgendamento, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
