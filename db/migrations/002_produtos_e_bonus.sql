-- Produtos do grupo que cada aluno pode abrir ('club', 'oratoria').
create table acessos (
  aluno_id uuid not null references alunos (id) on delete cascade,
  produto text not null,
  criado_em timestamptz not null default now(),
  primary key (aluno_id, produto)
);

-- Bônus que o aluno recebeu (outros treinamentos, materiais), mostrados como avisos na entrada do app.
create table bonus (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos (id) on delete cascade,
  titulo text not null,
  detalhe text not null default '',
  url text not null default '',
  criado_em timestamptz not null default now()
);
create index bonus_aluno on bonus (aluno_id);

-- Quem já tinha acesso antes desta mudança era aluno da Formação de Oratória.
insert into acessos (aluno_id, produto) select id, 'oratoria' from alunos where papel = 'aluno';
