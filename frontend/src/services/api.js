iconst API_URL =
  window?.runtimeConfig?.API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000";

export async function criarAgendamento(data) {
  const res = await fetch(`${API_URL}/agendamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Erro ao criar agendamento");
  }

  return res.json();
}
