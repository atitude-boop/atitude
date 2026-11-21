import type { Metadata } from 'next';
import Link from 'next/link';
import { exigeAluno } from '@/lib/auth';
import { db, type Plano } from '@/lib/db';
import { dataLonga, diaMes, hojeISO, semana } from '@/lib/datas';
import { gerarPlano } from '@/lib/plano';
import { IcoCheck } from '@/components/Icones';
import { alternarTreino, excluirPlano } from './actions';
import FormPlano from './FormPlano';

export const metadata: Metadata = { title: 'Plano de apresentação' };

export default async function PaginaPlano({ searchParams }: { searchParams: Promise<{ editar?: string }> }) {
  const aluno = await exigeAluno();
  const editar = (await searchParams).editar === '1';
  const hoje = hojeISO();
  const [p] = await db()<Plano[]>`select * from planos where aluno_id = ${aluno.id}`;

  const topo = (
    <div className="topo">
      <div className="txt">
        <span className="sobre">Plano de treino</span>
        <h1 className="titulo">Minha apresentação</h1>
      </div>
    </div>
  );

  if (!p || editar) {
    return (
      <>
        {topo}
        <FormPlano hoje={hoje} inicial={p && editar ? { nome: p.nome, tipo: p.tipo, duracao: p.duracao, data: p.data } : null} />
      </>
    );
  }

  const g = gerarPlano(p, hoje);
  const passou = g.faltam < 0;

  return (
    <>
      {topo}
      <div className="card hi">
        <div className="entre" style={{ alignItems: 'flex-start' }}>
          <div className="cresce">
            <span className="chip" style={{ alignSelf: 'flex-start' }}>{p.tipo} · {p.duracao}</span>
            <span className="h" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, marginTop: 6, overflowWrap: 'anywhere' }}>{p.nome}</span>
            <span className="mut" style={{ fontSize: 13 }}>{dataLonga(p.data)}</span>
          </div>
          <div className="quad" style={{ minWidth: 76, width: 'auto', height: 76, borderRadius: 16, padding: '0 8px' }}>
            <span className="h" style={{ fontSize: passou ? 16 : 26, fontWeight: 700, lineHeight: 1 }}>{passou ? 'Feita' : g.faltam === 0 ? 'Hoje' : g.faltam}</span>
            <span className="mut" style={{ fontSize: 11 }}>{passou ? diaMes(p.data) : g.faltam === 0 ? 'é o dia' : g.faltam === 1 ? 'dia' : 'dias'}</span>
          </div>
        </div>
        <div className="bar"><div style={{ width: `${g.total ? Math.round((g.feitos / g.total) * 100) : 0}%` }} /></div>
        <div className="entre">
          <span className="mut" style={{ fontSize: 13 }}><b style={{ color: 'var(--fg)' }}>{g.feitos} de {g.total}</b> treinos feitos</span>
          <Link href="/plano?editar=1" style={{ fontSize: 13, fontWeight: 600, textDecoration: 'none', minHeight: 36, display: 'flex', alignItems: 'center' }}>Editar apresentação</Link>
        </div>
      </div>

      {passou && (
        <div className="card">
          <span style={{ fontWeight: 600 }}>Sua apresentação já aconteceu.</span>
          <span className="mut" style={{ fontSize: 14 }}>Tem outra marcada? Monte um novo plano de treino.</span>
          <form action={excluirPlano}><button className="btn">Montar um novo plano</button></form>
        </div>
      )}

      {g.cortado && <span className="mut" style={{ fontSize: 13 }}>O plano começa em {diaMes(g.inicio)}, 30 dias antes da apresentação.</span>}
      <h2 className="sec">Um treino por dia</h2>
      <div className="lista">
        {g.treinos.map((t) => (
          <div key={t.k} style={{ minHeight: 64 }}>
            <div className={`dia${t.hoje ? ' hoje' : ''}`}><b>{t.dia}</b><small>{t.sem}</small></div>
            <div className="cresce">
              <span className="t" style={t.feito ? { color: 'var(--mut)' } : undefined}>{t.titulo}</span>
              <span className="s" style={t.feito ? { color: 'var(--gold)' } : t.atrasado ? { color: 'var(--err)' } : undefined}>
                {t.feito ? `Feito · ${t.fase}` : t.atrasado ? `Não feito · ${t.fase}` : `${t.fase} · ${t.min} min`}
              </span>
            </div>
            <form action={alternarTreino}>
              <input type="hidden" name="k" value={t.k} />
              <button className="marca" aria-pressed={t.feito} aria-label={(t.feito ? 'Desmarcar treino: ' : 'Marcar treino como feito: ') + t.titulo}>
                <span>{t.feito && <IcoCheck />}</span>
              </button>
            </form>
          </div>
        ))}
        <div style={{ minHeight: 64 }}>
          <div className="dia fim"><b>{diaMes(p.data)}</b><small>{g.faltam === 0 ? 'hoje' : semana(p.data)}</small></div>
          <div className="cresce">
            <span className="t" style={{ color: 'var(--gold-hi)' }}>Dia da apresentação</span>
            <span className="s">Aquecimento de voz de 5 min e respiração antes de entrar</span>
          </div>
        </div>
      </div>
    </>
  );
}
