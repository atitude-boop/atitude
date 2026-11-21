import type { Metadata } from 'next';
import { exigeEquipe } from '@/lib/auth';
import PainelNav from './PainelNav';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: { default: 'Painel da escola', template: '%s · Painel Atitude' } };

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await exigeEquipe();
  return (
    <main className="painel">
      <div>
        <span className="rot">Atitude · Painel da escola</span>
      </div>
      <PainelNav />
      {children}
    </main>
  );
}
