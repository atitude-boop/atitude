import postgres from 'postgres';

const g = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

function conectar() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL não definida.');
  return postgres(url, {
    max: 5,
    prepare: false,
    onnotice: () => {},
    // Datas (sem hora) chegam como texto 'AAAA-MM-DD', sem conversão de fuso.
    types: { date: { to: 1082, from: [1082], serialize: (x: string) => x, parse: (x: string) => x } },
  });
}

export function db() {
  if (!g.__sql) g.__sql = conectar();
  return g.__sql;
}

export type Aluno = {
  id: string; email: string; nome: string; papel: 'aluno' | 'equipe'; turma: string; whatsapp: string;
  ultimo_acesso: Date | null; criado_em: Date;
  empresa: string; cargo: string; o_que_faz: string; segmento: string; colaboradores: string; cidade: string;
  instagram: string; posso_ajudar: string; procuro: string; aparecer_conexoes: boolean;
  aniversario: string; faturamento: string; desafio: string; objetivo: string; como_conheceu: string;
};

export type Anexo = { nome: string; url: string };

export type Encontro = {
  numero: number; titulo: string; data: string | null; objetivo: string; pratica: string; tarefa: string;
  video_url: string; materiais: Anexo[]; links: Anexo[];
};

export type Plano = {
  aluno_id: string; nome: string; tipo: string; duracao: string; data: string; inicio: string; feitos: number[];
};

// Colunas do aluno que podem sair do servidor (nunca o hash do código).
export const COLUNAS_ALUNO = [
  'id', 'email', 'nome', 'papel', 'turma', 'whatsapp', 'ultimo_acesso', 'criado_em',
  'empresa', 'cargo', 'o_que_faz', 'segmento', 'colaboradores', 'cidade', 'instagram', 'posso_ajudar', 'procuro',
  'aparecer_conexoes', 'aniversario', 'faturamento', 'desafio', 'objetivo', 'como_conheceu',
] as const;

const CAMPOS_CADASTRO: (keyof Aluno)[] = [
  'empresa', 'cargo', 'o_que_faz', 'segmento', 'colaboradores', 'cidade', 'posso_ajudar', 'procuro',
  'whatsapp', 'aniversario', 'faturamento', 'desafio', 'objetivo', 'como_conheceu',
];

export function cadastroPct(a: Aluno) {
  const ok = CAMPOS_CADASTRO.filter((c) => String(a[c] ?? '').trim() !== '').length;
  return Math.round((ok / CAMPOS_CADASTRO.length) * 100);
}
