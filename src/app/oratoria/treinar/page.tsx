import type { Metadata } from 'next';
import Link from 'next/link';
import { db, type Plano } from '@/lib/db';
import { diaMes, hojeISO } from '@/lib/datas';
import { desafioDoDia, sequencia } from '@/lib/desafios';
import { gerarPlano } from '@/lib/plano';
import { acessosDe, exigeAcesso } from '@/lib/produtos';
import { IcoCadeado, IcoCheck, IcoConversa, IcoMicrofone, IcoPlano, IcoRoteiro, IcoVideo } from '@/components/Icones';

export const metadata: Metadata = { title: 'Treinar' };

export default async function Treinar({ searchParams }: { searchParams: Promise<{ feito?: string }> }) {
  const aluno = await exigeAcesso('oratoria');
  const hoje = hojeISO();
  const sql = db();
  const [treinos, [p], acessos] = await Promise.all([
    sql<{ dia: string }[]>`select dia from treinos_diarios where aluno_id = ${aluno.id}`,
    sql<Plano[]>`select * from planos where aluno_id = ${aluno.id}`,
    acessosDe(aluno.id, aluno.papel),
  ]);
  const dias = treinos.map((t) => t.dia);
  const feitoHoje = dias.includes(hoje);
  const seguidos = sequencia(dias, hoje);
  const g = p ? gerarPlano(p, hoje) : null;
  const acabou = (await searchParams).feito === '1' && feitoHoje;

  const atalhos = [
    { href: '/oratoria/plano', Ico: IcoPlano, nome: 'Minha apresentação', sub: p && g && g.faltam >= 0 ? `${diaMes(p.data)} · ${g.feitos} de ${g.total} treinos` : 'Plano de treino até o dia', aberto: true },
    { href: '/teleprompter', Ico: IcoRoteiro, nome: 'Teleprompter', sub: 'Leia o roteiro e grave', aberto: acessos.has('teleprompter') },
    { href: '/area/simulador', Ico: IcoConversa, nome: 'Simulador de vendas', sub: 'Cliente difícil por voz', aberto: acessos.has('simulador') },
    { href: '/area/analise', Ico: IcoVideo, nome: 'Análise de vídeo', sub: 'Feedback da sua oratória', aberto: acessos.has('analise') },
  ];

  return (
    <>
      <div className="topo">
        <div className="txt">
          <span className="sobre">Arena Atitude</span>
          <h1 className="titulo">Treinar</h1>
        </div>
      </div>

      {acabou && <div className="aviso" role="status"><IcoCheck size={18} /> Desafio concluído. {seguidos === 1 ? 'Sua sequência começou.' : `${seguidos} dias seguidos treinando.`}</div>}

      <div className="card hi" style={{ alignItems: 'center', gap: 12, padding: '20px 16px', textAlign: 'center' }}>
        {feitoHoje ? (
          <span className="quad" style={{ width: 84, height: 84, borderRadius: '50%' }}><IcoCheck size={34} /></span>
        ) : (
          <Link href="/oratoria/treinar/gravar" aria-label="Começar a gravação do desafio do dia" style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--gold)', border: '6px solid var(--line-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#141414' }}>
            <IcoMicrofone size={34} />
          </Link>
        )}
        <span className="rot">Desafio do dia · 60 segundos</span>
        <div className="h" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35 }}>{desafioDoDia(hoje)}</div>
        <span className="mut" style={{ fontSize: 13 }}>
          {feitoHoje ? 'Feito hoje. Amanhã tem um desafio novo.' : 'Toque no microfone, fale por um minuto e assista ao seu vídeo.'}
        </span>
        {feitoHoje && <Link href="/oratoria/treinar/gravar" className="btn sec2">Gravar de novo</Link>}
      </div>

      <div className="atalhos">
        {atalhos.map(({ href, Ico, nome, sub, aberto }) => (
          <Link key={href} href={href} className="card" style={{ gap: 6, padding: 14, position: 'relative' }}>
            <span className={aberto ? 'ouro' : 'mut'} style={{ display: 'flex' }}><Ico /></span>
            <span style={{ fontWeight: 600, fontSize: 14, color: aberto ? undefined : 'var(--mut)' }}>{nome}</span>
            <span className="mut" style={{ fontSize: 12 }}>{aberto ? sub : 'Não incluso no seu acesso'}</span>
            {!aberto && <span className="mut" style={{ position: 'absolute', top: 12, right: 12, display: 'flex' }}><IcoCadeado size={13} /></span>}
          </Link>
        ))}
      </div>
    </>
  );
}
