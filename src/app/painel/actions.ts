'use server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { exigeEquipe, hashCodigo, novoCodigo } from '@/lib/auth';
import { type Anexo, db } from '@/lib/db';
import { dataValida } from '@/lib/datas';

async function urlDoApp() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}/entrar`;
}

export type Acesso = { nome: string; email: string; whatsapp: string; codigo: string };
export type EstadoAlunos = { criados?: Acesso[]; erros?: string[]; url?: string; texto?: string };

const EMAIL = /^[^\s@;,]+@[^\s@;,]+\.[^\s@;,]+$/;

export async function adicionarAlunos(_: EstadoAlunos, form: FormData): Promise<EstadoAlunos> {
  await exigeEquipe();
  const texto = String(form.get('lista') ?? '');
  const turma = String(form.get('turma') ?? '').trim().slice(0, 60);
  const papel = form.get('equipe') === 'on' ? 'equipe' : 'aluno';
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  if (!linhas.length) return { erros: ['Escreva pelo menos um aluno: Nome; e-mail; WhatsApp'], texto };
  if (linhas.length > 200) return { erros: ['Envie no máximo 200 alunos por vez.'], texto };

  const sql = db();
  const criados: Acesso[] = [];
  const erros: string[] = [];
  const vistos = new Set<string>();
  const pendentes: string[] = []; // linhas que não entraram, devolvidas para correção
  for (const linha of linhas) {
    const [nome = '', emailBruto = '', whatsapp = ''] = linha.split(/[;\t]/).map((p) => p.trim());
    const email = emailBruto.toLowerCase();
    if (!nome || !EMAIL.test(email)) { erros.push(`“${linha}”: use o formato Nome; e-mail; WhatsApp`); pendentes.push(linha); continue; }
    if (vistos.has(email)) { erros.push(`${email}: repetido na lista`); continue; }
    vistos.add(email);
    const codigo = novoCodigo();
    const r = await sql`
      insert into alunos (email, nome, whatsapp, turma, papel, codigo_hash)
      values (${email}, ${nome.slice(0, 80)}, ${whatsapp.slice(0, 30)}, ${turma}, ${papel}, ${hashCodigo(codigo)})
      on conflict (email) do nothing returning id`;
    if (r.length) criados.push({ nome, email, whatsapp, codigo });
    else erros.push(`${email}: já está cadastrado`);
  }
  revalidatePath('/painel', 'layout');
  return { criados, erros, url: await urlDoApp(), texto: pendentes.join('\n') };
}

export type EstadoCodigo = { acesso?: Acesso; url?: string };

export async function gerarNovoCodigo(_: EstadoCodigo, form: FormData): Promise<EstadoCodigo> {
  await exigeEquipe();
  const id = String(form.get('id') ?? '');
  const codigo = novoCodigo();
  const sql = db();
  const [a] = await sql<{ nome: string; email: string; whatsapp: string }[]>`
    update alunos set codigo_hash = ${hashCodigo(codigo)}, tentativas = 0, bloqueado_ate = null
    where id = ${id} returning nome, email, whatsapp`;
  if (!a) return {};
  // O código antigo deixa de valer e os aparelhos conectados precisam entrar de novo.
  await sql`delete from sessoes where aluno_id = ${id}`;
  return { acesso: { ...a, codigo }, url: await urlDoApp() };
}

export async function salvarDadosAluno(form: FormData) {
  await exigeEquipe();
  const id = String(form.get('id') ?? '');
  const nome = String(form.get('nome') ?? '').trim().slice(0, 80);
  const turma = String(form.get('turma') ?? '').trim().slice(0, 60);
  const whatsapp = String(form.get('whatsapp') ?? '').trim().slice(0, 30);
  if (nome) await db()`update alunos set nome = ${nome}, turma = ${turma}, whatsapp = ${whatsapp} where id = ${id}`;
  revalidatePath('/painel', 'layout');
  redirect(`/painel/alunos/${id}?salvo=1`);
}

export async function excluirAluno(form: FormData) {
  const eu = await exigeEquipe();
  const id = String(form.get('id') ?? '');
  if (form.get('confirmo') !== 'on' || id === eu.id) redirect(`/painel/alunos/${id}`);
  await db()`delete from alunos where id = ${id}`;
  revalidatePath('/painel', 'layout');
  redirect('/painel/alunos');
}

export type EstadoEncontro = { erro?: string; ok?: boolean; n?: number; v?: Record<string, string> };

function lerAnexos(texto: string, rotulo: string): Anexo[] | string {
  const lista: Anexo[] = [];
  for (const linha of texto.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const i = linha.lastIndexOf('|');
    const nome = (i < 0 ? '' : linha.slice(0, i)).trim();
    const url = (i < 0 ? linha : linha.slice(i + 1)).trim();
    if (!/^https?:\/\/\S+$/i.test(url)) return `${rotulo}: o endereço “${url}” precisa começar com https://`;
    lista.push({ nome: (nome || url).slice(0, 120), url });
  }
  return lista;
}

export async function salvarEncontro(ant: EstadoEncontro, form: FormData): Promise<EstadoEncontro> {
  await exigeEquipe();
  // Devolve o que foi digitado, para o formulário não perder nada quando houver erro.
  const v: Record<string, string> = {};
  for (const c of ['titulo', 'data', 'objetivo', 'pratica', 'tarefa', 'video_url', 'materiais', 'links']) v[c] = String(form.get(c) ?? '');
  const n = (ant.n ?? 0) + 1;
  const numero = Number(form.get('numero'));
  const t = (c: string, max: number) => String(form.get(c) ?? '').trim().slice(0, max);
  const titulo = t('titulo', 100);
  const data = t('data', 10);
  const video = t('video_url', 500);
  if (!titulo) return { erro: 'O título não pode ficar vazio.', n, v };
  if (data && !dataValida(data)) return { erro: 'Data inválida.', n, v };
  if (video && !/^https?:\/\/\S+$/i.test(video)) return { erro: 'O link do vídeo precisa começar com https://', n, v };
  const materiais = lerAnexos(String(form.get('materiais') ?? ''), 'Materiais');
  if (typeof materiais === 'string') return { erro: materiais, n, v };
  const links = lerAnexos(String(form.get('links') ?? ''), 'Links');
  if (typeof links === 'string') return { erro: links, n, v };

  const sql = db();
  await sql`
    update encontros set titulo = ${titulo}, data = ${data || null}, objetivo = ${t('objetivo', 2000)}, pratica = ${t('pratica', 2000)},
      tarefa = ${t('tarefa', 2000)}, video_url = ${video}, materiais = ${sql.json(materiais)}, links = ${sql.json(links)}
    where numero = ${numero}`;
  revalidatePath('/', 'layout');
  return { ok: true, n, v };
}
