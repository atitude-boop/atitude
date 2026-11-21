'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { exigeAluno } from '@/lib/auth';
import { db, type Plano } from '@/lib/db';
import { dataValida, difDias, hojeISO } from '@/lib/datas';
import { DURACOES, gerarPlano, TIPOS } from '@/lib/plano';

export type EstadoPlano = { erro?: string; n?: number; v?: { nome: string; tipo: string; duracao: string; data: string } };

export async function salvarPlano(ant: EstadoPlano, form: FormData): Promise<EstadoPlano> {
  const aluno = await exigeAluno();
  const nome = String(form.get('nome') ?? '').trim().slice(0, 60) || 'Minha apresentação';
  const tipo = String(form.get('tipo') ?? '');
  const duracao = String(form.get('duracao') ?? '');
  const data = String(form.get('data') ?? '');
  const hoje = hojeISO();
  const volta = { n: (ant.n ?? 0) + 1, v: { nome: String(form.get('nome') ?? ''), tipo, duracao, data } };
  if (!TIPOS.includes(tipo) || !DURACOES.includes(duracao)) return { erro: 'Escolha o tipo e o tempo da apresentação.', ...volta };
  if (!dataValida(data) || difDias(data, hoje) < 0) return { erro: 'Escolha uma data a partir de hoje.', ...volta };
  if (difDias(data, hoje) > 366) return { erro: 'Escolha uma data dentro dos próximos 12 meses.', ...volta };

  const sql = db();
  const [atual] = await sql<Plano[]>`select * from planos where aluno_id = ${aluno.id}`;
  if (atual && atual.data === data) {
    // Mesma data: só atualiza os dados e mantém os treinos já feitos.
    await sql`update planos set nome = ${nome}, tipo = ${tipo}, duracao = ${duracao} where aluno_id = ${aluno.id}`;
  } else {
    await sql`
      insert into planos (aluno_id, nome, tipo, duracao, data, inicio, feitos)
      values (${aluno.id}, ${nome}, ${tipo}, ${duracao}, ${data}, ${hoje}, '{}')
      on conflict (aluno_id) do update set nome = excluded.nome, tipo = excluded.tipo, duracao = excluded.duracao,
        data = excluded.data, inicio = excluded.inicio, feitos = '{}', criado_em = now()`;
  }
  revalidatePath('/plano');
  revalidatePath('/');
  redirect('/plano');
}

export async function alternarTreino(form: FormData) {
  const aluno = await exigeAluno();
  const k = Number(form.get('k'));
  const sql = db();
  const [p] = await sql<Plano[]>`select * from planos where aluno_id = ${aluno.id}`;
  if (!p || !Number.isInteger(k) || k < 0 || k >= gerarPlano(p, hojeISO()).total) return;
  const feitos = p.feitos.includes(k) ? p.feitos.filter((x) => x !== k) : [...p.feitos, k].sort((a, b) => a - b);
  await sql`update planos set feitos = ${feitos} where aluno_id = ${aluno.id}`;
  revalidatePath('/plano');
  revalidatePath('/');
}

export async function excluirPlano() {
  const aluno = await exigeAluno();
  await db()`delete from planos where aluno_id = ${aluno.id}`;
  revalidatePath('/plano');
  revalidatePath('/');
  redirect('/plano');
}
