-- Script para inserir dados de exemplo no banco de dados
-- Execute este script após aplicar a migração principal

-- Inserir categorias financeiras
INSERT INTO financial_categories (name, type, description, color, icon) VALUES
('Salários', 'expense', 'Pagamentos de salários para instrutores', '#FF5733', 'dollar-sign'),
('Aluguel', 'expense', 'Aluguel do espaço físico', '#33A8FF', 'home'),
('Equipamentos', 'expense', 'Compra de equipamentos fotográficos', '#33FF57', 'camera'),
('Materiais', 'expense', 'Materiais didáticos e suprimentos', '#A833FF', 'book'),
('Marketing', 'expense', 'Despesas com publicidade e marketing', '#FFD133', 'megaphone'),
('Matrículas', 'income', 'Receitas de matrículas em cursos', '#33FFC1', 'users'),
('Vendas de Produtos', 'income', 'Receitas de vendas de produtos fotográficos', '#FF33A8', 'shopping-bag'),
('Serviços Fotográficos', 'income', 'Receitas de serviços fotográficos', '#3357FF', 'image');

-- Inserir cursos
INSERT INTO courses (name, slug, description, price, is_active) VALUES
('Fotografia Básica', 'fotografia-basica', 'Curso introdutório de fotografia para iniciantes', 499.90, TRUE),
('Fotografia Avançada', 'fotografia-avancada', 'Técnicas avançadas de fotografia para entusiastas', 699.90, TRUE),
('Fotografia de Retratos', 'fotografia-retratos', 'Especialização em fotografia de retratos e pessoas', 599.90, TRUE),
('Fotografia de Paisagens', 'fotografia-paisagens', 'Técnicas para capturar paisagens deslumbrantes', 599.90, TRUE),
('Edição de Imagens', 'edicao-imagens', 'Aprenda a editar suas fotos como um profissional', 449.90, TRUE),
('Fotografia Comercial', 'fotografia-comercial', 'Fotografia para produtos e publicidade', 799.90, TRUE),
('Iluminação Profissional', 'iluminacao-profissional', 'Técnicas avançadas de iluminação em estúdio', 899.90, TRUE),
('Fotografia com Smartphone', 'fotografia-smartphone', 'Tire fotos incríveis usando apenas seu smartphone', 299.90, TRUE);

-- Inserir turmas
INSERT INTO classes (course_id, course_name, days, period, price, total_spots, spots_available, is_active) VALUES
((SELECT id FROM courses WHERE slug = 'fotografia-basica'), 'Fotografia Básica', 'Segunda e Quarta', 'Noite', 499.90, 20, 20, TRUE),
((SELECT id FROM courses WHERE slug = 'fotografia-basica'), 'Fotografia Básica', 'Terça e Quinta', 'Manhã', 499.90, 15, 15, TRUE),
((SELECT id FROM courses WHERE slug = 'fotografia-avancada'), 'Fotografia Avançada', 'Terça e Quinta', 'Noite', 699.90, 15, 15, TRUE),
((SELECT id FROM courses WHERE slug = 'fotografia-retratos'), 'Fotografia de Retratos', 'Sábado', 'Integral', 599.90, 12, 12, TRUE),
((SELECT id FROM courses WHERE slug = 'fotografia-paisagens'), 'Fotografia de Paisagens', 'Domingo', 'Manhã', 599.90, 10, 10, TRUE),
((SELECT id FROM courses WHERE slug = 'edicao-imagens'), 'Edição de Imagens', 'Sexta', 'Noite', 449.90, 18, 18, TRUE),
((SELECT id FROM courses WHERE slug = 'fotografia-comercial'), 'Fotografia Comercial', 'Segunda e Quarta', 'Tarde', 799.90, 10, 10, TRUE),
((SELECT id FROM courses WHERE slug = 'iluminacao-profissional'), 'Iluminação Profissional', 'Terça e Quinta', 'Tarde', 899.90, 8, 8, TRUE),
((SELECT id FROM courses WHERE slug = 'fotografia-smartphone'), 'Fotografia com Smartphone', 'Sábado', 'Manhã', 299.90, 25, 25, TRUE);

-- Inserir cupons de desconto
INSERT INTO discount_coupons (code, discount_type, discount_value, course_id, valid_from, valid_until, max_uses, current_uses, description, is_active) VALUES
('BEMVINDO10', 'percentage', 10, NULL, NOW(), NOW() + INTERVAL '3 months', 100, 0, 'Cupom de boas-vindas 10% de desconto', TRUE),
('FOTOGRAFIA20', 'percentage', 20, (SELECT id FROM courses WHERE slug = 'fotografia-basica'), NOW(), NOW() + INTERVAL '1 month', 50, 0, 'Desconto especial para o curso de Fotografia Básica', TRUE),
('SMARTPHONE50', 'fixed', 50, (SELECT id FROM courses WHERE slug = 'fotografia-smartphone'), NOW(), NOW() + INTERVAL '2 weeks', 20, 0, 'Desconto fixo de R$50 para o curso de Fotografia com Smartphone', TRUE),
('INVERNO2025', 'percentage', 15, NULL, NOW(), '2025-09-21', 200, 0, 'Promoção de inverno 2025', TRUE);

-- Inserir perguntas de fotografia
INSERT INTO photography_questions (question, category, difficulty) VALUES
('Qual é a função do diafragma em uma câmera?', 'Técnica', 'Fácil'),
('O que significa ISO em fotografia?', 'Técnica', 'Fácil'),
('Qual é a regra dos terços?', 'Composição', 'Fácil'),
('O que é velocidade do obturador?', 'Técnica', 'Fácil'),
('O que é profundidade de campo?', 'Técnica', 'Médio'),
('Qual a diferença entre formato RAW e JPEG?', 'Técnica', 'Médio'),
('O que é balanço de branco?', 'Técnica', 'Médio'),
('O que é bracketing em fotografia?', 'Técnica', 'Difícil'),
('O que é o ponto doce de uma lente?', 'Equipamento', 'Difícil'),
('O que é fotografia HDR?', 'Técnica', 'Médio');

-- Inserir respostas para as perguntas
-- Pergunta 1
INSERT INTO photography_answers (question_id, answer_text, is_correct) VALUES
((SELECT id FROM photography_questions WHERE question = 'Qual é a função do diafragma em uma câmera?'), 'Controlar a quantidade de luz que entra na câmera', TRUE),
((SELECT id FROM photography_questions WHERE question = 'Qual é a função do diafragma em uma câmera?'), 'Ajustar o foco da imagem', FALSE),
((SELECT id FROM photography_questions WHERE question = 'Qual é a função do diafragma em uma câmera?'), 'Definir o tempo de exposição', FALSE),
((SELECT id FROM photography_questions WHERE question = 'Qual é a função do diafragma em uma câmera?'), 'Estabilizar a imagem', FALSE);

-- Pergunta 2
INSERT INTO photography_answers (question_id, answer_text, is_correct) VALUES
((SELECT id FROM photography_questions WHERE question = 'O que significa ISO em fotografia?'), 'Sensibilidade do sensor à luz', TRUE),
((SELECT id FROM photography_questions WHERE question = 'O que significa ISO em fotografia?'), 'Intensidade do Sistema Óptico', FALSE),
((SELECT id FROM photography_questions WHERE question = 'O que significa ISO em fotografia?'), 'Índice de Saturação Óptica', FALSE),
((SELECT id FROM photography_questions WHERE question = 'O que significa ISO em fotografia?'), 'Integração de Sistema Operacional', FALSE);

-- Pergunta 3
INSERT INTO photography_answers (question_id, answer_text, is_correct) VALUES
((SELECT id FROM photography_questions WHERE question = 'Qual é a regra dos terços?'), 'Uma técnica de composição que divide a imagem em nove partes iguais', TRUE),
((SELECT id FROM photography_questions WHERE question = 'Qual é a regra dos terços?'), 'Uma regra que determina que apenas um terço da foto deve estar em foco', FALSE),
((SELECT id FROM photography_questions WHERE question = 'Qual é a regra dos terços?'), 'Uma técnica que exige que três elementos principais estejam na foto', FALSE),
((SELECT id FROM photography_questions WHERE question = 'Qual é a regra dos terços?'), 'Uma regra que limita o uso de apenas três cores na composição', FALSE);

-- Inserir assinantes da newsletter
INSERT INTO newsletter_subscribers (email, active, source) VALUES
('exemplo1@email.com', TRUE, 'site'),
('exemplo2@email.com', TRUE, 'instagram'),
('exemplo3@email.com', TRUE, 'facebook'),
('exemplo4@email.com', TRUE, 'indicacao'),
('exemplo5@email.com', FALSE, 'site');

-- Inserir configurações de IA
INSERT INTO ai_settings (provider, model, api_key) VALUES
('openai', 'gpt-4', 'sk-exemplo-chave-api-nao-real');

-- Inserir transações financeiras
INSERT INTO transactions (type, amount, description, transaction_date) VALUES
('income', 499.90, 'Matrícula curso Fotografia Básica', CURRENT_DATE - INTERVAL '5 days'),
('income', 699.90, 'Matrícula curso Fotografia Avançada', CURRENT_DATE - INTERVAL '4 days'),
('income', 599.90, 'Matrícula curso Fotografia de Retratos', CURRENT_DATE - INTERVAL '3 days'),
('expense', 1200.00, 'Aluguel do estúdio', CURRENT_DATE - INTERVAL '2 days'),
('expense', 500.00, 'Materiais didáticos', CURRENT_DATE - INTERVAL '1 day'),
('income', 899.90, 'Matrícula curso Iluminação Profissional', CURRENT_DATE),
('expense', 350.00, 'Anúncios no Instagram', CURRENT_DATE);

-- Inserir contas a pagar
INSERT INTO payables (description, amount, supplier, due_date, status, category_id) VALUES
('Aluguel mensal', 2500.00, 'Imobiliária Central', CURRENT_DATE + INTERVAL '5 days', 'pending', (SELECT id FROM financial_categories WHERE name = 'Aluguel')),
('Compra de tripés', 1200.00, 'FotoEquipamentos LTDA', CURRENT_DATE + INTERVAL '10 days', 'pending', (SELECT id FROM financial_categories WHERE name = 'Equipamentos')),
('Materiais impressos', 800.00, 'Gráfica Rápida', CURRENT_DATE + INTERVAL '3 days', 'pending', (SELECT id FROM financial_categories WHERE name = 'Materiais')),
('Campanha de marketing digital', 1500.00, 'Agência Digital', CURRENT_DATE - INTERVAL '2 days', 'paid', (SELECT id FROM financial_categories WHERE name = 'Marketing'));

-- Inserir contas a receber
INSERT INTO receivables (description, amount, customer, due_date, status, category_id) VALUES
('Matrícula João Silva', 499.90, 'João Silva', CURRENT_DATE + INTERVAL '5 days', 'pending', (SELECT id FROM financial_categories WHERE name = 'Matrículas')),
('Matrícula Maria Souza', 699.90, 'Maria Souza', CURRENT_DATE + INTERVAL '3 days', 'pending', (SELECT id FROM financial_categories WHERE name = 'Matrículas')),
('Matrícula Carlos Oliveira', 599.90, 'Carlos Oliveira', CURRENT_DATE - INTERVAL '1 day', 'paid', (SELECT id FROM financial_categories WHERE name = 'Matrículas')),
('Venda de livro de fotografia', 150.00, 'Ana Santos', CURRENT_DATE - INTERVAL '3 days', 'paid', (SELECT id FROM financial_categories WHERE name = 'Vendas de Produtos'));
