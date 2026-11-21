import type { Metadata } from 'next';
import Link from 'next/link';
import { exigeAluno } from '@/lib/auth';
import { db, type Encontro } from '@/lib/db';
import { dataHora, diaMes } from '@/lib/datas';
import { IcoCheck, IcoSeta } from '@/components/Icones';

export const metadata: Metadata = { title: 'Jornada' };

export default async function Jornada({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const aluno = await exigeAluno();
  const historico = (await searchParams).aba === 'historico';
  const sql = db();
  const [encontros, presencas] = await Promise.all([
    sql<Pick<Encontro, 'numero' | 'titulo' | 'data'>[]>`select numero, titulo, data from encontros order by numero`,
    sql<{ encontro: number; confirmado_em: Date }[]>`select encontro, confirmado_em from presencas where aluno_id = ${aluno.id} order by encontro`,
  ]);
  const quando = new Map(presencas.map((p) => [p.encontro, p.confirmado_em]));
  const n = (x: number) => String(x).padStart(2, '0');

  return (
    <>
      <div className="topo">
        <div className="txt">
          <span className="sobre">Método Atitude</span>
          <h1 className="titulo">Sua jornada</h1>
        </div>
      </div>
      <nav className="abas" aria-label="Seções da jornada">
        <Link href="/jornada" aria-current={!historico ? 'page' : undefined}>Trilha</Link>
        <Link href="/jornada?aba=historico" aria-current={historico ? 'page' : undefined}>Histórico ({presencas.length})</Link>
      </nav>

      {!historico ? (
        <>
          <div className="card hi" style={{ padding: '12px 16px', gap: 7 }}>
            <div className="entre">
              <span style={{ fontWeight: 600, fontSize: 14 }}>Sua frequência</span>
              <span className="h ouro" style={{ fontSize: 17, fontWeight: 700 }}>
                {presencas.length}<span className="mut" style={{ fontSize: 13, fontWeight: 500 }}> de 11 encontros</span>
              </span>
            </div>
            <div className="bar"><div style={{ width: `${Math.round((presencas.length / 11) * 100)}%` }} /></div>
          </div>
          <div className="lista">
            {encontros.map((e) => {
              const ok = quando.has(e.numero);
              const formatura = e.numero === 11;
              return (
                <Link key={e.numero} href={`/jornada/${e.numero}`} className={formatura ? 'destaque' : undefined}>
                  <span className="num">{n(e.numero)}</span>
                  <span className="cresce">
                    <span className="t">{formatura ? `Encontro 11 · ${e.titulo}` : e.titulo}</span>
                    <span className="s" style={ok || formatura ? { color: 'var(--gold)' } : undefined}>
                      {ok ? 'Presença confirmada' : formatura ? 'Certificado + vídeo do antes e depois' : e.data ? `Encontro em ${diaMes(e.data)}` : 'Toque para abrir a aula'}
                    </span>
                  </span>
                  {ok ? <span className="ok"><IcoCheck /></span> : <span className="mut" style={{ display: 'flex' }}><IcoSeta /></span>}
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <span className="mut" style={{ fontSize: 13 }}>Presenças confirmadas. Elas contam para o seu certificado.</span>
          {presencas.length === 0 ? (
            <div className="card"><span className="mut" style={{ fontSize: 14 }}>Você ainda não confirmou presença. Abra o encontro na Trilha e toque em “Marcar presença”.</span></div>
          ) : (
            <div className="lista">
              {presencas.map((p) => (
                <div key={p.encontro}>
                  <span className="ok" style={{ width: 30, height: 30 }}><IcoCheck size={16} /></span>
                  <span className="cresce">
                    <span className="t">Encontro {n(p.encontro)} · {encontros.find((e) => e.numero === p.encontro)?.titulo}</span>
                    <span className="s">Presença confirmada em {dataHora(p.confirmado_em)}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
