import Link from 'next/link';
import { cadastroPct, db, type Encontro, type Plano } from '@/lib/db';
import { diaMes, difDias, hojeISO, saudacao } from '@/lib/datas';
import { desafioDoDia, nivelDe, sequencia } from '@/lib/desafios';
import { gerarPlano } from '@/lib/plano';
import { exigeAcesso } from '@/lib/produtos';
import { IcoCheck, IcoGrupo, IcoMicrofone, IcoPlay, IcoSeta } from '@/components/Icones';

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export default async function Inicio() {
  const aluno = await exigeAcesso('oratoria');
  const sql = db();
  const hoje = hojeISO();
  const [encontros, presencas, planos, treinos] = await Promise.all([
    sql<Pick<Encontro, 'numero' | 'titulo' | 'data'>[]>`select numero, titulo, data from encontros order by numero`,
    sql<{ encontro: number }[]>`select encontro from presencas where aluno_id = ${aluno.id}`,
    sql<Plano[]>`select * from planos where aluno_id = ${aluno.id}`,
    sql<{ dia: string }[]>`select dia from treinos_diarios where aluno_id = ${aluno.id}`,
  ]);
  const presentes = new Set(presencas.map((p) => p.encontro));
  const dias = treinos.map((t) => t.dia);
  const nivel = nivelDe(dias.length);
  const seguidos = sequencia(dias, hoje);
  const feitoHoje = dias.includes(hoje);
  const proximoPresencial = encontros.find((e) => e.data && difDias(e.data, hoje) >= 0);
  const continuar = encontros.find((e) => !presentes.has(e.numero));
  const plano = planos[0] ? { ...planos[0], ...gerarPlano(planos[0], hoje) } : null;
  const planoAtivo = plano && plano.faltam >= 0 ? plano : null;
  const pct = cadastroPct(aluno);

  return (
    <>
      <div className="topo" style={{ justifyContent: 'space-between' }}>
        <div className="txt">
          <span className="sobre">{saudacao()},</span>
          <h1 className="titulo">{aluno.nome.trim().split(/\s+/)[0]}</h1>
        </div>
        <Link href="/" className="voltar" aria-label="Voltar para a Atitude Educação"><IcoGrupo /></Link>
      </div>

      <div className="card hi">
        <div className="entre">
          <span className="chip">Nível {nivel.numero} de 5</span>
          <span className="mut" style={{ fontSize: 12 }}>
            {seguidos === 0 ? 'Comece a sua sequência hoje' : seguidos === 1 ? '1 dia treinando' : `${seguidos} dias seguidos treinando`}
          </span>
        </div>
        <div className="h" style={{ fontSize: 20, fontWeight: 600 }}>{nivel.nome}</div>
        <div className="bar"><div style={{ width: `${nivel.pct}%` }} /></div>
        <span className="mut" style={{ fontSize: 13 }}>
          {nivel.proximo
            ? <>{nivel.faltam === 1 ? 'Falta 1 desafio' : `Faltam ${nivel.faltam} desafios`} para chegar ao nível <b style={{ color: 'var(--fg)' }}>{nivel.proximo}</b></>
            : 'Você chegou ao nível mais alto. Continue treinando todos os dias.'}
        </span>
      </div>

      <div className="card">
        <div className="rot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IcoMicrofone size={16} /> Desafio do dia · 60 segundos</div>
        <div className="h" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35 }}>{desafioDoDia(hoje)}</div>
        {feitoHoje
          ? <div className="btn sec2" style={{ cursor: 'default' }}><IcoCheck size={18} /> Desafio de hoje concluído</div>
          : <Link className="btn" href="/oratoria/treinar/gravar">Gravar agora</Link>}
        <Link href="/oratoria/plano" className="entre" style={{ minHeight: 36, fontSize: 13, fontWeight: 600, textDecoration: 'none', color: 'var(--gold-hi)', borderTop: '1px solid var(--line)', paddingTop: 8 }}>
          <span>
            {planoAtivo
              ? `${planoAtivo.nome} · ${planoAtivo.faltam === 0 ? 'é hoje' : planoAtivo.faltam === 1 ? 'falta 1 dia' : `faltam ${planoAtivo.faltam} dias`}`
              : 'Tem uma apresentação marcada? Monte um plano de treino'}
          </span>
          <IcoSeta />
        </Link>
      </div>

      {proximoPresencial?.data && (
        <Link href={`/oratoria/jornada/${proximoPresencial.numero}`} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="quad" style={{ width: 56, height: 56, borderRadius: 14 }}>
            <span className="h" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>{proximoPresencial.data.slice(8, 10)}</span>
            <span className="mut" style={{ fontSize: 10 }}>{MESES[Number(proximoPresencial.data.slice(5, 7)) - 1]}</span>
          </div>
          <div className="cresce">
            <span className="mut" style={{ fontSize: 12 }}>Próximo encontro presencial{difDias(proximoPresencial.data, hoje) === 0 ? ' · hoje' : ''}</span>
            <span style={{ fontWeight: 600 }}>{proximoPresencial.titulo}</span>
            <span className="mut" style={{ fontSize: 12 }}>Encontro {String(proximoPresencial.numero).padStart(2, '0')} de 11</span>
          </div>
          <IcoSeta />
        </Link>
      )}

      {continuar && (
        <>
          <h2 className="sec">Continue de onde parou</h2>
          <Link href={`/oratoria/jornada/${continuar.numero}`} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <div className="quad" style={{ width: 64, height: 48, borderRadius: 10, background: 'var(--line)' }}><IcoPlay size={20} /></div>
            <div className="cresce" style={{ gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Módulo {continuar.numero} · {continuar.titulo}{continuar.data ? ` · ${diaMes(continuar.data)}` : ''}</span>
              <div className="bar" style={{ height: 5 }}><div style={{ width: `${Math.round((presentes.size / 11) * 100)}%` }} /></div>
              <span className="mut" style={{ fontSize: 11.5 }}>{presentes.size} de 11 encontros com presença</span>
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
        </Link>
      )}
    </>
  );
}
