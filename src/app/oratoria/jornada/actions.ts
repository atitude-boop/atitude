'use server';
import { revalidatePath } from 'next/cache';
import { exigeAcesso } from '@/lib/produtos';
import { db } from '@/lib/db';
import { diaMes, difDias, hojeISO } from '@/lib/datas';

export type EstadoPresenca = { ok?: boolean; erro?: string };

export async function confirmarPresenca(numero: number): Promise<EstadoPresenca> {
  const aluno = await exigeAcesso('oratoria');
  if (!Number.isInteger(numero) || numero < 1 || numero > 11) return { erro: 'Encontro inválido.' };
  const sql = db();
  const [e] = await sql<{ data: string | null }[]>`select data from encontros where numero = ${numero}`;
  if (!e) return { erro: 'Encontro não encontrado.' };
  if (e.data && difDias(e.data, hojeISO()) > 0) {
    return { erro: `A presença deste encontro abre em ${diaMes(e.data)}.` };
  }
  await sql`insert into presencas (aluno_id, encontro) values (${aluno.id}, ${numero}) on conflict do nothing`;
  revalidatePath('/', 'layout');
  return { ok: true };
}
