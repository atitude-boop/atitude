import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import { type Aluno, COLUNAS_ALUNO, db } from './db';

const COOKIE = 'sessao';
const DIAS_SESSAO = 90;
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sem 0/O, 1/I/L

export function normalizaCodigo(s: string) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function novoCodigo() {
  let c = '';
  for (let i = 0; i < 8; i++) c += ALFABETO[randomInt(ALFABETO.length)];
  return c.slice(0, 4) + '-' + c.slice(4);
}

export function hashCodigo(codigo: string) {
  const salt = randomBytes(16);
  return salt.toString('hex') + ':' + scryptSync(normalizaCodigo(codigo), salt, 32).toString('hex');
}

export function confereCodigo(codigo: string, hash: string) {
  const [s, h] = hash.split(':');
  if (!s || !h) return false;
  const esperado = Buffer.from(h, 'hex');
  const obtido = scryptSync(normalizaCodigo(codigo), Buffer.from(s, 'hex'), 32);
  return esperado.length === obtido.length && timingSafeEqual(esperado, obtido);
}

const sha = (t: string) => createHash('sha256').update(t).digest('hex');

export async function criarSessao(alunoId: string) {
  const token = randomBytes(32).toString('base64url');
  const expira = new Date(Date.now() + DIAS_SESSAO * 86400000);
  const sql = db();
  await sql`insert into sessoes (token_hash, aluno_id, expira_em) values (${sha(token)}, ${alunoId}, ${expira})`;
  await sql`delete from sessoes where expira_em < now()`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expira,
  });
}

export async function encerrarSessao() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db()`delete from sessoes where token_hash = ${sha(token)}`;
  jar.delete(COOKIE);
}

export const alunoAtual = cache(async (): Promise<Aluno | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const sql = db();
  const r = await sql<Aluno[]>`
    select ${sql(COLUNAS_ALUNO.map((c) => 'a.' + c))} from sessoes s join alunos a on a.id = s.aluno_id
    where s.token_hash = ${sha(token)} and s.expira_em > now()`;
  return r[0] ?? null;
});

export async function exigeAluno() {
  const a = await alunoAtual();
  if (!a) redirect('/entrar');
  return a;
}

export async function exigeEquipe() {
  const a = await exigeAluno();
  if (a.papel !== 'equipe') redirect('/');
  return a;
}
