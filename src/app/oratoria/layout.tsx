import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { registraAcesso } from '@/lib/auth';
import { exigeAcesso } from '@/lib/produtos';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: { default: 'Formação de Oratória', template: '%s · Oratória Atitude' } };

export default async function OratoriaLayout({ children }: { children: React.ReactNode }) {
  await registraAcesso(await exigeAcesso('oratoria'));
  return (
    <>
      <main className="tela">{children}</main>
      <Nav />
    </>
  );
}
