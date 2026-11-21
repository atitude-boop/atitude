import Link from 'next/link';
import { exigeAcesso } from '@/lib/produtos';
import { cadastroPct, db, type Encontro, type Plano } from '@/lib/db';
import { diaMes, difDias, hojeISO } from '@/lib/datas';
import { gerarPlano } from '@/lib/plano';
import { IcoPlano, IcoPlay, IcoSeta } from '@/components/Icones';

export default async function Inicio() {
  const aluno = await exigeAcesso('oratoria');
  const sql = db();
  const hoje = hojeISO();
  const [encontros, presencas, planos] = await Promise.all([
    sql<Pick<Encontro, 'numero' | 'titulo' | 'data'>[]>`select numero, titulo, data from encontros order by numero`,
    sql<{ encontro: number }[]>`select encontro from presencas where aluno_id = ${aluno.id}`,
    sql<Plano[]>`select * from planos where aluno_id = ${aluno.id}`,
  ]);
  const feitos = new Set(presencas.map((p) => p.encontro));
  const proximo = encontros.find((e) => !feitos.has(e.numero));
  const plano = planos[0] ? { ...planos[0], ...gerarPlano(planos[0], hoje) } : null;
  const treinoHoje = plano?.treinos.find((t) => t.hoje && !t.feito);
  const pct = cadastroPct(aluno);

  return (
    <>
      <div className="topo">
        <div className="txt">
          <span className="sobre">Atitude Educação</span>
          <h1 className="titulo">Formação de Oratória</h1>
        </div>
      </div>

      <Link href="/oratoria/jornada" className="card hi">
        <div className="entre">
          <span style={{ fontWeight: 600 }}>Sua frequência</span>
          <span className="h ouro" style={{ fontSize: 18, fontWeight: 700 }}>
            {feitos.size}<span className="mut" style={{ fontSize: 13, fontWeight: 500 }}> de 11 encontros</span>
          </span>
        </div>
        <div className="bar"><div style={{ width: `${Math.round((feitos.size / 11) * 100)}%` }} /></div>
        <span className="mut" style={{ fontSize: 13 }}>
          {feitos.size === 11 ? 'Jornada completa. Parabéns pela formatura!' : 'A presença em cada encontro conta para o seu certificado.'}
        </span>
      </Link>

      {plano && plano.faltam >= 0 ? (
        <Link href="/oratoria/plano" className="card">
          <div className="linha">
            <div className="quad" style={{ width: 56, height: 56, borderRadius: 14 }}>
              <span className="h" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{plano.faltam === 0 ? 'Hoje' : plano.faltam}</span>
              {plano.faltam > 0 && <span className="mut" style={{ fontSize: 10 }}>{plano.faltam === 1 ? 'DIA' : 'DIAS'}</span>}
            </div>
            <div className="cresce">
              <span className="mut" style={{ fontSize: 12 }}>Sua apresentação · {diaMes(plano.data)}</span>
              <span style={{ fontWeight: 600 }}>{plano.nome}</span>
              <span className="mut" style={{ fontSize: 12 }}>{plano.feitos} de {plano.total} treinos feitos</span>
            </div>
            <IcoSeta />
          </div>
          {treinoHoje && (
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="rot">Treino de hoje · {treinoHoje.min} min</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{treinoHoje.titulo}</span>
            </div>
          )}
        </Link>
      ) : (
        <Link href="/oratoria/plano" className="card">
          <div className="linha">
            <div className="quad"><IcoPlano /></div>
            <div className="cresce">
              <span style={{ fontWeight: 600 }}>Tem uma apresentação marcada?</span>
              <span className="mut" style={{ fontSize: 12.5 }}>Monte um plano de treino até o dia</span>
            </div>
            <IcoSeta />
          </div>
        </Link>
      )}

      {proximo && (
        <>
          <h2 className="sec">Continue de onde parou</h2>
          <Link href={`/oratoria/jornada/${proximo.numero}`} className="card">
            <div className="linha">
              <div className="quad" style={{ width: 64, height: 48, borderRadius: 10, background: 'var(--line)' }}><IcoPlay size={20} /></div>
              <div className="cresce">
                <span className="mut" style={{ fontSize: 12 }}>
                  Encontro {String(proximo.numero).padStart(2, '0')}
                  {proximo.data ? ` · ${difDias(proximo.data, hoje) === 0 ? 'hoje' : diaMes(proximo.data)}` : ''}
                </span>
                <span style={{ fontWeight: 600 }}>{proximo.titulo}</span>
              </div>
              <IcoSeta />
            </div>
          </Link>
        </>
      )}

      {pct < 100 && (
        <Link href="/cadastro" className="card">
          <div className="entre">
            <span style={{ fontWeight: 600 }}>Complete o seu cadastro</span>
            <span className="chip">{pct}%</span>
          </div>
          <div className="bar" style={{ height: 6 }}><div style={{ width: `${pct}%` }} /></div>
          <span className="mut" style={{ fontSize: 12.5 }}>Conte sobre você e o seu negócio para a escola te acompanhar melhor.</span>
        </Link>
      )}
    </>
  );
}
