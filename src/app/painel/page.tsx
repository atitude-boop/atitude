import Link from 'next/link';
import { db } from '@/lib/db';
import { linkWhats } from '@/lib/opcoes';
import { textoAcesso } from '@/lib/datas';

type Linha = { id: string; nome: string; turma: string; whatsapp: string; ultimo_acesso: Date | null; presencas: number };

export default async function VisaoGeral() {
  const sql = db();
  const [[n], sumindo, nunca] = await Promise.all([
    sql<{ total: number; ativos: number; sumindo: number; nunca: number; planos: number; presencas: number }[]>`
      select count(*)::int as total,
        count(*) filter (where ultimo_acesso > now() - interval '7 days')::int as ativos,
        count(*) filter (where ultimo_acesso < now() - interval '14 days')::int as sumindo,
        count(*) filter (where ultimo_acesso is null)::int as nunca,
        (select count(*)::int from planos pl join alunos x on x.id = pl.aluno_id where x.papel = 'aluno' and pl.data >= current_date) as planos,
        (select count(*)::int from presencas pr join alunos x on x.id = pr.aluno_id where x.papel = 'aluno') as presencas
      from alunos where papel = 'aluno'`,
    sql<Linha[]>`
      select a.id, a.nome, a.turma, a.whatsapp, a.ultimo_acesso, (select count(*)::int from presencas p where p.aluno_id = a.id) as presencas
      from alunos a where a.papel = 'aluno' and a.ultimo_acesso < now() - interval '14 days' order by a.ultimo_acesso limit 50`,
    sql<Linha[]>`
      select a.id, a.nome, a.turma, a.whatsapp, a.ultimo_acesso, 0 as presencas
      from alunos a where a.papel = 'aluno' and a.ultimo_acesso is null order by a.criado_em limit 50`,
  ]);
  const media = n.total ? (n.presencas / n.total).toFixed(1).replace('.', ',') : '0';

  return (
    <>
      <h1 className="titulo">O que o app está te dizendo</h1>
      <div className="indicadores">
        <div className="card"><span className="mut">Alunos com acesso</span><span className="n">{n.total}</span><span className="mut" style={{ fontSize: 13 }}>{n.nunca} ainda não entraram</span></div>
        <div className="card"><span className="mut">Ativos na semana</span><span className="n">{n.ativos}</span><span className="mut" style={{ fontSize: 13 }}>Abriram o app nos últimos 7 dias</span></div>
        <div className="card"><span className="mut">Alunos em risco</span><span className="n" style={n.sumindo ? { color: 'var(--err)' } : undefined}>{n.sumindo}</span><span className="mut" style={{ fontSize: 13 }}>Sem abrir o app há 14 dias ou mais</span></div>
        <div className="card"><span className="mut">Presenças por aluno</span><span className="n">{media}</span><span className="mut" style={{ fontSize: 13 }}>Média, de 11 encontros</span></div>
        <div className="card"><span className="mut">Com apresentação marcada</span><span className="n">{n.planos}</span><span className="mut" style={{ fontSize: 13 }}>Planos de treino em andamento</span></div>
      </div>

      {n.total === 0 && (
        <div className="card hi">
          <span style={{ fontWeight: 600 }}>Nenhum aluno cadastrado ainda.</span>
          <span className="mut">Comece criando os acessos da turma. Cada aluno recebe um código para entrar.</span>
          <Link href="/painel/alunos" className="btn" style={{ alignSelf: 'flex-start', width: 'auto' }}>Adicionar alunos</Link>
        </div>
      )}

      <div className="duas">
        <div className="card">
          <h2 className="sec">Alunos sumindo: resgatar antes que desistam</h2>
          {sumindo.length === 0 ? <span className="mut">Ninguém está há 14 dias ou mais sem abrir o app.</span> : sumindo.map((a) => <LinhaAluno key={a.id} a={a} msg="Sentimos a sua falta no app. Como está a sua jornada?" />)}
        </div>
        <div className="card">
          <h2 className="sec">Ainda não entraram no app</h2>
          {nunca.length === 0 ? <span className="mut">Todos os alunos cadastrados já entraram.</span> : nunca.map((a) => <LinhaAluno key={a.id} a={a} msg="O seu acesso ao App do Aluno já está liberado. Conseguiu entrar?" />)}
        </div>
      </div>
    </>
  );
}

function LinhaAluno({ a, msg }: { a: Linha; msg: string }) {
  const whats = linkWhats(a.whatsapp, `Olá, ${a.nome.split(/\s+/)[0]}! Aqui é da Atitude. ${msg}`);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--line2)' }}>
      <div className="cresce" style={{ minWidth: 160 }}>
        <Link href={`/painel/alunos/${a.id}`} style={{ fontWeight: 600, textDecoration: 'none', color: 'var(--fg)' }}>{a.nome}</Link>
        <span className="mut" style={{ fontSize: 13 }}>{textoAcesso(a.ultimo_acesso)}{a.ultimo_acesso ? ` · ${a.presencas} de 11 presenças` : ''}{a.turma ? ` · ${a.turma}` : ''}</span>
      </div>
      {whats
        ? <a className="btn p sec2" href={whats} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>
        : <Link className="btn p fantasma" href={`/painel/alunos/${a.id}`}>Sem WhatsApp · abrir</Link>}
    </div>
  );
}
