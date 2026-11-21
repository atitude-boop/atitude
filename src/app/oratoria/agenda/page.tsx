import type { Metadata } from 'next';
import Link from 'next/link';
import { db, type Encontro } from '@/lib/db';
import { dataLonga, difDias, hojeISO } from '@/lib/datas';
import { exigeAcesso } from '@/lib/produtos';
import { IcoCheck, IcoSeta } from '@/components/Icones';

export const metadata: Metadata = { title: 'Agenda' };
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export default async function Agenda() {
  const aluno = await exigeAcesso('oratoria');
  const hoje = hojeISO();
  const sql = db();
  const [encontros, presencas] = await Promise.all([
    sql<Pick<Encontro, 'numero' | 'titulo' | 'data'>[]>`select numero, titulo, data from encontros where data is not null order by data, numero`,
    sql<{ encontro: number }[]>`select encontro from presencas where aluno_id = ${aluno.id}`,
  ]);
  const presentes = new Set(presencas.map((p) => p.encontro));
  const proximos = encontros.filter((e) => difDias(e.data!, hoje) >= 0);
  const passados = encontros.filter((e) => difDias(e.data!, hoje) < 0).reverse();

  const linha = (e: (typeof encontros)[number], passado: boolean) => (
    <Link key={e.numero} href={`/oratoria/jornada/${e.numero}`}>
      <span className={`dia${difDias(e.data!, hoje) === 0 ? ' hoje' : ''}`} style={{ width: 46, height: 46 }}>
        <b style={{ fontSize: 16 }}>{e.data!.slice(8, 10)}</b><small>{MESES[Number(e.data!.slice(5, 7)) - 1]}</small>
      </span>
      <span className="cresce">
        <span className="t">{e.titulo}</span>
        <span className="s">Encontro {String(e.numero).padStart(2, '0')} · {difDias(e.data!, hoje) === 0 ? 'hoje' : dataLonga(e.data!)}</span>
      </span>
      {presentes.has(e.numero)
        ? <span className="chip"><IcoCheck size={12} /> Presente</span>
        : passado ? <span className="chip trancado">Sem presença</span> : <span className="mut" style={{ display: 'flex' }}><IcoSeta /></span>}
    </Link>
  );

  return (
    <>
      <div className="topo">
        <div className="txt">
          <span className="sobre">Formação de Oratória</span>
          <h1 className="titulo">Agenda</h1>
        </div>
      </div>
      <h2 className="sec">Próximos encontros</h2>
      {proximos.length
        ? <div className="lista">{proximos.map((e) => linha(e, false))}</div>
        : <div className="card"><span className="mut" style={{ fontSize: 14 }}>{encontros.length ? 'Não há encontros marcados daqui para a frente.' : 'A escola ainda não publicou as datas dos encontros.'}</span></div>}
      {passados.length > 0 && (
        <>
          <h2 className="sec">Já aconteceram</h2>
          <div className="lista">{passados.map((e) => linha(e, true))}</div>
        </>
      )}
    </>
  );
}
