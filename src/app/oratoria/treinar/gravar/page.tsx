import type { Metadata } from 'next';
import Link from 'next/link';
import { hojeISO } from '@/lib/datas';
import { desafioDoDia } from '@/lib/desafios';
import { exigeAcesso } from '@/lib/produtos';
import { IcoVoltar } from '@/components/Icones';
import Gravador from './Gravador';

export const metadata: Metadata = { title: 'Desafio do dia' };

export default async function Gravar() {
  await exigeAcesso('oratoria');
  return (
    <>
      <div className="topo">
        <Link href="/oratoria/treinar" className="voltar" aria-label="Voltar para Treinar"><IcoVoltar /></Link>
        <div className="txt">
          <span className="rot">Desafio do dia · 60 segundos</span>
          <h1 className="titulo m">Gravar</h1>
        </div>
      </div>
      <Gravador desafio={desafioDoDia(hojeISO())} />
    </>
  );
}
