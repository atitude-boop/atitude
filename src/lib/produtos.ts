import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { exigeAluno } from './auth';
import { db } from './db';
import { PRODUTOS, type ProdutoId } from './catalogo';

// Produtos que o aluno pode abrir. O Atitude Club dá acesso a tudo; a equipe também.
export const acessosDe = cache(async (alunoId: string, papel: string): Promise<Set<ProdutoId>> => {
  const todos = new Set(PRODUTOS.map((p) => p.id));
  if (papel === 'equipe') return todos;
  const r = await db()<{ produto: string }[]>`select produto from acessos where aluno_id = ${alunoId}`;
  const tem = new Set(r.map((x) => x.produto));
  if (tem.has('club')) return todos;
  return new Set(PRODUTOS.map((p) => p.id).filter((id) => tem.has(id)));
});

export async function exigeAcesso(produto: ProdutoId) {
  const aluno = await exigeAluno();
  if (!(await acessosDe(aluno.id, aluno.papel)).has(produto)) redirect('/');
  return aluno;
}
