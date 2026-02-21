-- =====================================================
-- Supabase Setup SQL — Execute no SQL Editor do Supabase
-- Dashboard → SQL Editor → New query → Cole e execute
-- =====================================================

-- 1. Tabela de simulações
CREATE TABLE IF NOT EXISTS simulations (
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_simulations_user_id ON simulations(user_id);

-- 2. Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de questões já vistas (cycling)
CREATE TABLE IF NOT EXISTS seen_questions (
    user_id TEXT PRIMARY KEY,
    question_ids TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de flashcard progress
CREATE TABLE IF NOT EXISTS flashcard_progress (
    user_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, question_id)
);

CREATE INDEX idx_flashcard_user ON flashcard_progress(user_id);

-- 5. Row Level Security (RLS) — permite que cada user só acesse seus dados
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE seen_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir tudo para o anon key (o user_id é filtrado no código)
-- Isso é seguro porque os dados NÃO são sensíveis (apenas progresso de estudo)
CREATE POLICY "Allow all for anon" ON simulations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON user_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON seen_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON flashcard_progress FOR ALL USING (true) WITH CHECK (true);
