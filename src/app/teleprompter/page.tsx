import type { Metadata } from 'next';
import Link from 'next/link';
import { registraAcesso } from '@/lib/auth';
import { exigeAcesso } from '@/lib/produtos';
import { IcoVoltar } from '@/components/Icones';
import Teleprompter from './Teleprompter';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Teleprompter' };

export default async function PaginaTeleprompter() {
  await registraAcesso(await exigeAcesso('teleprompter'));
  return (
    <main className="tela sem-nav">
      <div className="topo">
        <Link href="/" className="voltar" aria-label="Voltar para o início"><IcoVoltar /></Link>
        <div className="txt">
          <span className="rot">Nossos aplicativos</span>
          <h1 className="titulo m">Teleprompter</h1>
        </div>
      </div>
      <Teleprompter />
    </main>
  );
}
