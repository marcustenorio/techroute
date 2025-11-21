CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    data_visita DATE NOT NULL,
    hora_visita TIME NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    tecnico VARCHAR(255) NOT NULL,
    tipo_servico VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materiais (
    id SERIAL PRIMARY KEY,
    agendamento_id INTEGER,
    item VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
);

CREATE TABLE IF NOT EXISTS status_visita (
    id SERIAL PRIMARY KEY,
    agendamento_id INTEGER,
    status VARCHAR(100) NOT NULL,
    motivo TEXT,
    atualizado_em TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
);

CREATE TABLE IF NOT EXISTS observacoes (
    id SERIAL PRIMARY KEY,
    agendamento_id INTEGER,
    texto TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
);

