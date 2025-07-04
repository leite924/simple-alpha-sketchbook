
-- Inserir posts de blog mockados
INSERT INTO public.blog_posts (
  title,
  slug,
  content,
  excerpt,
  featured_image,
  status,
  author_id,
  categories,
  published_at,
  created_at,
  updated_at
) VALUES 
(
  'Técnicas Básicas de Fotografia para Iniciantes',
  'tecnicas-basicas-fotografia-iniciantes',
  '<h2>Introdução à Fotografia</h2><p>A fotografia é uma arte que combina técnica e criatividade. Neste artigo, vamos explorar as técnicas fundamentais que todo iniciante deve conhecer.</p><h3>Composição</h3><p>A regra dos terços é uma das técnicas mais importantes na fotografia. Imagine dividir sua imagem em nove partes iguais e posicione os elementos importantes nas intersecções dessas linhas.</p><h3>Iluminação</h3><p>A luz é o elemento mais importante na fotografia. Aprenda a observar como a luz incide sobre o seu assunto e como isso afeta o humor da imagem.</p>',
  'Descubra as técnicas fundamentais da fotografia e como aplicá-las para criar imagens mais impactantes.',
  'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3',
  'published',
  null,
  ARRAY['Técnicas', 'Iniciantes', 'Composição'],
  now() - interval '2 days',
  now() - interval '2 days',
  now() - interval '2 days'
),
(
  'Como Dominar a Fotografia de Retratos',
  'como-dominar-fotografia-retratos',
  '<h2>A Arte do Retrato</h2><p>A fotografia de retratos é uma das modalidades mais desafiadoras e gratificantes da fotografia. Requer não apenas conhecimento técnico, mas também habilidades interpessoais.</p><h3>Configurações da Câmera</h3><p>Para retratos, recomenda-se usar uma abertura ampla (f/1.4 a f/2.8) para criar um belo desfoque de fundo.</p><h3>Direção e Posicionamento</h3><p>Saiba como dirigir seu modelo e encontrar os melhores ângulos para cada tipo de rosto.</p>',
  'Aprenda as técnicas essenciais para criar retratos profissionais e impactantes.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
  'published',
  null,
  ARRAY['Retratos', 'Técnicas Avançadas', 'Iluminação'],
  now() - interval '5 days',
  now() - interval '5 days',
  now() - interval '5 days'
),
(
  'Fotografia de Paisagem: Capturando a Natureza',
  'fotografia-paisagem-capturando-natureza',
  '<h2>Explorando a Fotografia de Paisagem</h2><p>A fotografia de paisagem nos permite capturar a beleza natural do mundo ao nosso redor.</p><h3>Equipamentos Essenciais</h3><p>Um tripé é fundamental para fotografias de paisagem, especialmente para longas exposições.</p><h3>Horário Dourado</h3><p>As melhores fotos de paisagem são frequentemente capturadas durante o nascer ou pôr do sol.</p>',
  'Descubra como capturar paisagens deslumbrantes e criar imagens que transmitam a grandiosidade da natureza.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3',
  'published',
  null,
  ARRAY['Paisagem', 'Natureza', 'Equipamentos'],
  now() - interval '1 week',
  now() - interval '1 week',
  now() - interval '1 week'
),
(
  'Edição de Fotos: Lightroom vs Photoshop',
  'edicao-fotos-lightroom-vs-photoshop',
  '<h2>Qual Software Escolher?</h2><p>A edição é uma parte crucial do processo fotográfico moderno. Lightroom e Photoshop são as ferramentas mais populares.</p><h3>Adobe Lightroom</h3><p>Ideal para organização e edições básicas de grandes volumes de fotos.</p><h3>Adobe Photoshop</h3><p>Perfeito para edições complexas e manipulações avançadas.</p>',
  'Compare as principais ferramentas de edição e descubra qual é a melhor para seu estilo de trabalho.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
  'published',
  null,
  ARRAY['Edição', 'Software', 'Tutorial'],
  now() - interval '3 days',
  now() - interval '3 days',
  now() - interval '3 days'
),
(
  'Street Photography: Capturando a Vida Urbana',
  'street-photography-capturando-vida-urbana',
  '<h2>A Arte da Fotografia de Rua</h2><p>A street photography documenta a vida cotidiana nas ruas, capturando momentos espontâneos e genuínos.</p><h3>Discrição é Fundamental</h3><p>Aprenda a se mover discretamente e capturar momentos naturais.</p><h3>Equipamentos Leves</h3><p>Use equipamentos compactos que não chamem atenção.</p>',
  'Explore as técnicas da fotografia de rua e aprenda a documentar a vida urbana de forma autêntica.',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3',
  'published',
  null,
  ARRAY['Street Photography', 'Urbano', 'Documentário'],
  now() - interval '4 days',
  now() - interval '4 days',
  now() - interval '4 days'
);

-- Adicionar dados de autor e tempo de leitura aos posts existentes
UPDATE public.blog_posts 
SET 
  author = 'Marina Silva',
  read_time = '5 min'
WHERE author IS NULL;
