
-- Primeiro, vamos limpar e popular as tabelas com dados consistentes
DELETE FROM classes;
DELETE FROM courses;

-- Inserir cursos com UUIDs válidos
INSERT INTO courses (id, name, slug, description, price, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Fotografia Básica', 'fotografia-basica', 'Curso completo de fotografia básica com foco em fundamentos técnicos e composição.', 1200.00, true),
('550e8400-e29b-41d4-a716-446655440002', 'Fotografia Avançada', 'fotografia-avancada', 'Técnicas avançadas de fotografia para entusiastas.', 1800.00, true),
('550e8400-e29b-41d4-a716-446655440003', 'Fotografia de Retratos', 'fotografia-retratos', 'Especialização em fotografia de retratos e pessoas.', 1500.00, true);

-- Inserir turmas com UUIDs válidos que correspondem aos dados mock
INSERT INTO classes (id, course_id, course_name, days, period, price, total_spots, spots_available, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Fotografia Básica', 'Segundas e Quartas', 'Noturno', 1200.00, 15, 5, true),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Fotografia Básica', 'Terças e Quintas', 'Matutino', 1200.00, 15, 10, true),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Fotografia Avançada', 'Segundas e Quartas', 'Noturno', 1800.00, 12, 8, true),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Fotografia de Retratos', 'Sábados', 'Integral', 1500.00, 10, 6, true);
