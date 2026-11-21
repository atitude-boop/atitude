create table alunos (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text not null,
  papel text not null default 'aluno' check (papel in ('aluno', 'equipe')),
  turma text not null default '',
  whatsapp text not null default '',
  codigo_hash text not null,
  tentativas int not null default 0,
  bloqueado_ate timestamptz,
  ultimo_acesso timestamptz,
  criado_em timestamptz not null default now(),
  -- visível para a comunidade
  empresa text not null default '',
  cargo text not null default '',
  o_que_faz text not null default '',
  segmento text not null default '',
  colaboradores text not null default '',
  cidade text not null default '',
  instagram text not null default '',
  posso_ajudar text not null default '',
  procuro text not null default '',
  aparecer_conexoes boolean not null default true,
  -- só a escola vê
  aniversario text not null default '',
  faturamento text not null default '',
  desafio text not null default '',
  objetivo text not null default '',
  como_conheceu text not null default ''
);

create table sessoes (
  token_hash text primary key,
  aluno_id uuid not null references alunos (id) on delete cascade,
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null
);
create index sessoes_aluno on sessoes (aluno_id);

create table encontros (
  numero int primary key check (numero between 1 and 11),
  titulo text not null,
  data date,
  objetivo text not null default '',
  pratica text not null default '',
  tarefa text not null default '',
  video_url text not null default '',
  materiais jsonb not null default '[]',
  links jsonb not null default '[]'
);

create table presencas (
  aluno_id uuid not null references alunos (id) on delete cascade,
  encontro int not null references encontros (numero),
  confirmado_em timestamptz not null default now(),
  primary key (aluno_id, encontro)
);

create table planos (
  aluno_id uuid primary key references alunos (id) on delete cascade,
  nome text not null,
  tipo text not null,
  duracao text not null,
  data date not null,
  inicio date not null,
  feitos int[] not null default '{}',
  criado_em timestamptz not null default now()
);

insert into encontros (numero, titulo, objetivo, pratica, tarefa) values
(1, 'Presença e postura', 'Entrar no palco transmitindo segurança antes de dizer a primeira palavra.', 'Entrada, posição dos pés e postura com o microfone de mão.', 'Grave 60s se apresentando e assista prestando atenção na sua postura.'),
(2, 'Voz, ritmo e respiração', 'Usar a voz como ferramenta: volume, tom, velocidade e pausas.', 'Exercícios de respiração, projeção e leitura com ênfase.', 'Leia um texto em voz alta por 3 dias, marcando as pausas.'),
(3, 'Abertura de impacto', 'Prender a atenção da plateia nos primeiros 30 segundos.', '3 tipos de abertura: pergunta, dado surpreendente e história.', 'Escreva 3 aberturas para a sua próxima apresentação.'),
(4, 'Storytelling que gera conexão', 'Contar histórias sem vitimização, com uma lição que o outro possa replicar.', 'Montar o mapa da sua história com as energias de cada momento.', 'Escreva a sua história em até 2 minutos e grave.'),
(5, 'Linguagem corporal e olhar', 'Gestos na Zona P, contato visual firme e o fim dos vícios corporais.', 'Gravação em dupla com feedback sobre gestos e olhar.', 'Grave 2 minutos de corpo inteiro e analise a sua Zona P.'),
(6, 'Persuasão e pitch', 'Estruturar uma fala que leva o outro à decisão.', 'O roteiro de pitch em 9 passos, aplicado ao seu negócio.', 'Apresente o seu pitch para 3 pessoas e anote as objeções.'),
(7, 'Improviso e perguntas difíceis', 'Responder perguntas difíceis sem travar e sem perder a autoridade.', 'Rodada de perguntas surpresa da turma.', 'Liste as 5 perguntas que você mais teme e responda gravando.'),
(8, 'Apresentações com slides', 'Usar os slides como apoio, e não como muleta.', 'Montar 5 slides que sustentam a mensagem.', 'Refaça uma apresentação antiga com a nova estrutura.'),
(9, 'Comunicação em vídeo e redes', 'Falar para a câmera com naturalidade e presença.', 'Gravar um vídeo de 60 segundos para as redes.', 'Publique o seu vídeo e acompanhe os comentários.'),
(10, 'Palco: sua primeira palestra', 'Preparar e apresentar sua primeira palestra completa.', 'Ensaio geral com tempo cronometrado.', 'Faça 2 ensaios completos gravados.'),
(11, 'Formatura', 'Celebrar a sua evolução e receber o certificado.', 'Apresentação final e entrega dos certificados.', 'Grave uma mensagem para a próxima turma.');
