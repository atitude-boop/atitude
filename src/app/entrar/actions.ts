'use server';
import { redirect } from 'next/navigation';
import { confereCodigo, criarSessao, encerrarSessao, hashCodigo } from '@/lib/auth';
import { db } from '@/lib/db';

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MIN = 15;
// Usado quando o e-mail não existe, para a resposta demorar o mesmo tempo.
const HASH_FALSO = hashCodigo('XXXXXXXX');

export type EstadoEntrar = { erro?: string; email?: string };

export async function entrar(_: EstadoEntrar, form: FormData): Promise<EstadoEntrar> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const codigo = String(form.get('codigo') ?? '');
  if (!email || !codigo) return { erro: 'Preencha o e-mail e o código de acesso.', email };

  const sql = db();
  const [a] = await sql<{ id: string; codigo_hash: string; tentativas: number; bloqueado_ate: Date | null }[]>`
    select id, codigo_hash, tentativas, bloqueado_ate from alunos where email = ${email}`;

  if (a?.bloqueado_ate && a.bloqueado_ate > new Date()) {
    return { erro: `Muitas tentativas. Aguarde ${BLOQUEIO_MIN} minutos e tente de novo.`, email };
  }
  const ok = confereCodigo(codigo, a?.codigo_hash ?? HASH_FALSO) && !!a;
  if (!ok) {
    if (a) {
      const n = a.tentativas + 1;
      if (n >= MAX_TENTATIVAS) {
        await sql`update alunos set tentativas = 0, bloqueado_ate = now() + make_interval(mins => ${BLOQUEIO_MIN}) where id = ${a.id}`;
      } else {
        await sql`update alunos set tentativas = ${n} where id = ${a.id}`;
      }
    }
    return { erro: 'E-mail ou código incorretos. Confira a mensagem que a escola enviou.', email };
  }

  await sql`update alunos set tentativas = 0, bloqueado_ate = null, ultimo_acesso = now() where id = ${a.id}`;
  await criarSessao(a.id);
  redirect('/');
}

export async function sair() {
  await encerrarSessao();
  redirect('/entrar');
}
