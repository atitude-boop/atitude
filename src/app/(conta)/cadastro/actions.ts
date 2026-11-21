'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { exigeAluno } from '@/lib/auth';
import { db } from '@/lib/db';
import { COLABORADORES, FATURAMENTOS } from '@/lib/opcoes';


export async function salvarCadastro(form: FormData) {
  const aluno = await exigeAluno();
  const t = (campo: string, max = 300) => String(form.get(campo) ?? '').trim().slice(0, max);
  const opcao = (campo: string, lista: string[]) => { const v = t(campo); return lista.includes(v) ? v : ''; };
  const nome = t('nome', 80) || aluno.nome;
  const dados = {
    nome,
    empresa: t('empresa', 80), cargo: t('cargo', 80), o_que_faz: t('o_que_faz'), segmento: t('segmento', 80),
    colaboradores: opcao('colaboradores', COLABORADORES), cidade: t('cidade', 80), instagram: t('instagram', 120),
    posso_ajudar: t('posso_ajudar'), procuro: t('procuro'), aparecer_conexoes: form.get('aparecer_conexoes') === 'on',
    whatsapp: t('whatsapp', 30), aniversario: t('aniversario', 10), faturamento: opcao('faturamento', FATURAMENTOS),
    desafio: t('desafio', 600), objetivo: t('objetivo', 600), como_conheceu: t('como_conheceu'),
  };
  const sql = db();
  await sql`update alunos set ${sql(dados)} where id = ${aluno.id}`;
  revalidatePath('/', 'layout');
  redirect('/perfil?salvo=1');
}
