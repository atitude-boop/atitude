'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { hojeISO } from '@/lib/datas';
import { exigeAcesso } from '@/lib/produtos';

export async function concluirDesafio() {
  const aluno = await exigeAcesso('oratoria');
  await db()`insert into treinos_diarios (aluno_id, dia) values (${aluno.id}, ${hojeISO()}) on conflict do nothing`;
  revalidatePath('/', 'layout');
  redirect('/oratoria/treinar?feito=1');
}
