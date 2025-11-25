import React, { useState } from "react";
import { criarAgendamento } from "../services/api";
import "./AgendamentoForm.css";

const TECNICOS = [
  "Selecione...",
  "João Silva",
  "Maria Souza",
  "Carlos Pereira",
  "Ana Lima",
];

const TIPOS_SERVICO = [
  "Selecione...",
  "Instalação",
  "Manutenção",
  "Visita Técnica",
  "Suporte Emergencial",
];

export default function AgendamentoForm({ onCreated }) {
  const [form, setForm] = useState({
    data: "",
    hora: "",
    localizacao: "",
    tecnico: "",
    tipo_servico: "",
    observacao: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);

    // validação mínima (não deixa passar vazio)
    if (
      !form.data ||
      !form.hora ||
      !form.localizacao ||
      !form.tecnico ||
      !form.tipo_servico ||
      form.tecnico === "Selecione..." ||
      form.tipo_servico === "Selecione..."
    ) {
      setMsg({ type: "error", text: "Preencha todos os campos obrigatórios." });
      return;
    }

    setLoading(true);
    try {
      const created = await criarAgendamento(form);
      setMsg({ type: "success", text: "Agendamento salvo com sucesso!" });
      setForm({
        data: "",
        hora: "",
        localizacao: "",
        tecnico: "",
        tipo_servico: "",
        observacao: "",
      });
      onCreated?.(created);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Novo Agendamento</h2>
      <p className="subtitle">
        Registre uma visita técnica com data, horário, local e responsável.
      </p>

      <form onSubmit={submit} className="form">
        <div className="grid">
          <label>
            Data*
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={update}
            />
          </label>

          <label>
            Hora*
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={update}
            />
          </label>

          <label className="full">
            Localização do cliente*
            <input
              type="text"
              name="localizacao"
              placeholder="Ex.: Rua X, 123 – Centro"
              value={form.localizacao}
              onChange={update}
            />
          </label>

          <label>
            Técnico*
            <select name="tecnico" value={form.tecnico} onChange={update}>
              {TECNICOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            Tipo de serviço*
            <select
              name="tipo_servico"
              value={form.tipo_servico}
              onChange={update}
            >
              {TIPOS_SERVICO.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="full">
            Observação (opcional)
            <textarea
              name="observacao"
              placeholder="Detalhes adicionais..."
              rows="3"
              value={form.observacao}
              onChange={update}
            />
          </label>
        </div>

        {msg && (
          <div className={`msg ${msg.type}`}>
            {msg.text}
          </div>
        )}

        <button disabled={loading}>
          {loading ? "Salvando..." : "Salvar Agendamento"}
        </button>
      </form>
    </div>
  );
}
