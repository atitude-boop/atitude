import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigeAluno } from '@/lib/auth';
import { db, type Encontro } from '@/lib/db';
import { dataHora, diaMes, difDias, hojeISO } from '@/lib/datas';
import { IcoArquivo, IcoLink, IcoPlay, IcoVoltar } from '@/components/Icones';
import Presenca from './Presenca';

export const metadata: Metadata = { title: 'Aula' };

type Props = { params: Promise<{ n: string }>; searchParams: Promise<{ aba?: string }> };

export default async function Aula({ params, searchParams }: Props) {
  const aluno = await exigeAluno();
  const numero = Number((await params).n);
  if (!Number.isInteger(numero) || numero < 1 || numero > 11) notFound();
  const abaPedida = (await searchParams).aba;
  const aba = abaPedida === 'materiais' || abaPedida === 'links' ? abaPedida : 'sobre';
  const sql = db();
  const [[e], [p]] = await Promise.all([
    sql<Encontro[]>`select * from encontros where numero = ${numero}`,
    sql<{ confirmado_em: Date }[]>`select confirmado_em from presencas where aluno_id = ${aluno.id} and encontro = ${numero}`,
  ]);
  if (!e) notFound();
  const base = `/jornada/${numero}`;
  const futuro = e.data && difDias(e.data, hojeISO()) > 0;
  const itens = aba === 'materiais' ? e.materiais : e.links;

  return (
    <>
      <div className="topo">
        <Link href="/jornada" className="voltar" aria-label="Voltar para a trilha"><IcoVoltar /></Link>
        <div className="txt">
          <span className="rot">Encontro {String(numero).padStart(2, '0')}{e.data ? ` · ${diaMes(e.data)}` : ''}</span>
          <h1 className="titulo m">{e.titulo}</h1>
        </div>
      </div>

      {e.video_url ? (
        <a className="video" href={e.video_url} target="_blank" rel="noopener noreferrer">
          <span className="play"><IcoPlay /></span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Parte teórica · aula gravada</span>
          <span className="mut" style={{ fontSize: 12 }}>Assista antes do encontro prático · abre no YouTube</span>
        </a>
      ) : (
        <div className="video" style={{ minHeight: 110 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Parte teórica · aula gravada</span>
          <span className="mut" style={{ fontSize: 12.5 }}>O vídeo desta aula ainda não foi publicado pela escola.</span>
        </div>
      )}

      <nav className="abas" aria-label="Conteúdo da aula">
        <Link href={base} replace aria-current={aba === 'sobre' ? 'page' : undefined}>Sobre a aula</Link>
        <Link href={`${base}?aba=materiais`} replace aria-current={aba === 'materiais' ? 'page' : undefined}>Materiais</Link>
        <Link href={`${base}?aba=links`} replace aria-current={aba === 'links' ? 'page' : undefined}>Links</Link>
      </nav>

      {aba === 'sobre' ? (
        <div className="card" style={{ gap: 12 }}>
          {([['Objetivo', e.objetivo], ['O que vamos praticar', e.pratica], ['Tarefa para casa', e.tarefa]] as const)
            .filter(([, t]) => t.trim())
            .map(([r, t]) => (
              <div className="bloco" key={r}><span className="rot">{r}</span><p>{t}</p></div>
            ))}
          {!(e.objetivo + e.pratica + e.tarefa).trim() && <span className="mut" style={{ fontSize: 14 }}>O professor ainda não escreveu o conteúdo desta aula.</span>}
        </div>
      ) : itens.length === 0 ? (
        <div className="card">
          <span className="mut" style={{ fontSize: 14 }}>
            {aba === 'materiais' ? 'Nenhum material publicado para este encontro ainda.' : 'Nenhum link publicado para este encontro ainda.'}
          </span>
        </div>
      ) : (
        <div className="lista">
          {itens.map((x, i) => (
            <a key={i} href={x.url} target="_blank" rel="noopener noreferrer">
              <span className="ouro" style={{ display: 'flex' }}>{aba === 'materiais' ? <IcoArquivo /> : <IcoLink />}</span>
              <span className="cresce"><span className="t">{x.nome}</span></span>
              <span className="ouro" style={{ fontSize: 12.5, fontWeight: 600 }}>{aba === 'materiais' ? 'Baixar' : 'Abrir'}</span>
            </a>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Presenca
          numero={numero}
          titulo={e.titulo}
          confirmadaEm={p ? dataHora(p.confirmado_em) : null}
          abreEm={!p && futuro && e.data ? diaMes(e.data) : null}
        />
      </div>
    </>
  );
}
