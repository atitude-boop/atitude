import { exigeAluno, registraAcesso } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  await registraAcesso(await exigeAluno());
  return <main className="tela sem-nav">{children}</main>;
}
