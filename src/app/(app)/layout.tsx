import Nav from '@/components/Nav';
import { exigeAluno } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const aluno = await exigeAluno();
  // Registra o acesso no máximo uma vez por hora (usado no painel para ver quem está sumindo).
  if (!aluno.ultimo_acesso || Date.now() - aluno.ultimo_acesso.getTime() > 3600_000) {
    await db()`update alunos set ultimo_acesso = now() where id = ${aluno.id}`;
  }
  return (
    <>
      <main className="tela">{children}</main>
      <Nav />
    </>
  );
}
