-- Um registro por dia em que o aluno fez o desafio de 60 segundos (base da sequência de dias e do nível).
create table treinos_diarios (
  aluno_id uuid not null references alunos (id) on delete cascade,
  dia date not null,
  feito_em timestamptz not null default now(),
  primary key (aluno_id, dia)
);
