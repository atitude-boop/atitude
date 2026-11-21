import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigeEquipe } from '@/lib/auth';
import { cadastroPct, db, type Aluno, type Plano } from '@/lib/db';
import { dataHora, dataLonga, textoAcesso } from '@/lib/datas';
import { linkWhats } from '@/lib/opcoes';
import { excluirAluno, salvarDadosAluno } from '../../actions';
import NovoCodigo from './NovoCodigo';

export const metadata: Metadata = { title: 'Aluno' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PaginaAluno({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ salvo?: string }> }) {
  const eu = await exigeEquipe();
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const sql = db();
  const [[a], presencas, [plano]] = await Promise.all([
    sql<Aluno[]>`select * from alunos where id = ${id}`,
    sql<{ encontro: number; titulo: string; confirmado_em: Date }[]>`
      select p.encontro, e.titulo, p.confirmado_em from presencas p join encontros e on e.numero = p.encontro
      where p.aluno_id = ${id} order by p.encontro`,
    sql<Plano[]>`select * from planos where aluno_id = ${id}`,
  ]);
  if (!a) notFound();
  const whats = linkWhats(a.whatsapp, `Olá, ${a.nome.split(/\s+/)[0]}! Aqui é da Atitude.`);
  const v = (x: string) => x.trim() || '—';

  return (
    <>
      <div className="entre" style={{ flexWrap: 'wrap' }}>
        <div>
          <Link href="/painel/alunos" style={{ fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Todos os alunos</Link>
          <h1 className="titulo" style={{ marginTop: 4 }}>{a.nome}</h1>
          <span className="mut">{a.email} · {a.papel === 'equipe' ? 'Equipe' : a.turma ? `Turma ${a.turma}` : 'Sem turma'}</span>
        </div>
        {whats && <a className="btn p" href={whats} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>}
      </div>
      {(await searchParams).salvo === '1' && <div className="aviso" role="status">Dados salvos.</div>}

      <div className="indicadores">
        <div className="card"><span className="mut">Último acesso</span><span className="n" style={{ fontSize: 22 }}>{textoAcesso(a.ultimo_acesso)}</span></div>
        <div className="card"><span className="mut">Presenças</span><span className="n">{presencas.length}<span className="mut" style={{ fontSize: 14, fontWeight: 500 }}> de 11</span></span></div>
        <div className="card"><span className="mut">Cadastro</span><span className="n">{cadastroPct(a)}%</span></div>
      </div>

      <div className="duas">
        <div className="card">
          <h2 className="sec">Sobre o aluno e a empresa</h2>
          <dl>
            <dt>Empresa</dt><dd>{v(a.empresa)}</dd>
            <dt>Cargo</dt><dd>{v(a.cargo)}</dd>
            <dt>O que a empresa faz</dt><dd>{v(a.o_que_faz)}</dd>
            <dt>Segmento</dt><dd>{v(a.segmento)}</dd>
            <dt>Colaboradores</dt><dd>{v(a.colaboradores)}</dd>
            <dt>Cidade</dt><dd>{v(a.cidade)}</dd>
            <dt>Instagram ou site</dt><dd>{v(a.instagram)}</dd>
            <dt>Pode ajudar com</dt><dd>{v(a.posso_ajudar)}</dd>
            <dt>Está procurando</dt><dd>{v(a.procuro)}</dd>
          </dl>
        </div>
        <div className="card">
          <h2 className="sec">Só a escola vê</h2>
          <dl>
            <dt>WhatsApp</dt><dd>{v(a.whatsapp)}</dd>
            <dt>Aniversário</dt><dd>{v(a.aniversario)}</dd>
            <dt>Faturamento</dt><dd>{v(a.faturamento)}</dd>
            <dt>Maior desafio</dt><dd>{v(a.desafio)}</dd>
            <dt>Objetivo com a Atitude</dt><dd>{v(a.objetivo)}</dd>
            <dt>Como conheceu</dt><dd>{v(a.como_conheceu)}</dd>
            <dt>Apresentação marcada</dt><dd>{plano ? `${plano.nome} · ${dataLonga(plano.data)} · ${plano.feitos.length} treinos feitos` : '—'}</dd>
          </dl>
        </div>
      </div>

      <div className="duas">
        <div className="card">
          <h2 className="sec">Presenças confirmadas</h2>
          {presencas.length === 0 ? <span className="mut">Nenhuma presença confirmada ainda.</span> : (
            <dl>
              {presencas.map((p) => (
                <div key={p.encontro} style={{ display: 'contents' }}><dt>{dataHora(p.confirmado_em)}</dt><dd>Encontro {p.encontro} · {p.titulo}</dd></div>
              ))}
            </dl>
          )}
        </div>
        <NovoCodigo id={a.id} />
      </div>

      <div className="duas">
        <form action={salvarDadosAluno} className="card" style={{ gap: 14 }}>
          <h2 className="sec">Corrigir dados</h2>
          <input type="hidden" name="id" value={a.id} />
          <div className="campo"><label htmlFor="nome">Nome</label><input id="nome" name="nome" type="text" defaultValue={a.nome} maxLength={80} required /></div>
          <div className="campo"><label htmlFor="turma">Turma</label><input id="turma" name="turma" type="text" defaultValue={a.turma} maxLength={60} /></div>
          <div className="campo"><label htmlFor="whatsapp">WhatsApp</label><input id="whatsapp" name="whatsapp" type="tel" defaultValue={a.whatsapp} maxLength={30} /></div>
          <button className="btn p sec2" style={{ alignSelf: 'flex-start' }}>Salvar</button>
        </form>
        {a.id !== eu.id && (
          <form action={excluirAluno} className="card" style={{ gap: 14 }}>
            <h2 className="sec">Excluir acesso</h2>
            <span className="mut" style={{ fontSize: 14 }}>Apaga o aluno, o cadastro, as presenças e o plano. Não dá para desfazer.</span>
            <input type="hidden" name="id" value={a.id} />
            <label className="check"><input type="checkbox" name="confirmo" required /><span>Confirmo que quero excluir {a.nome}</span></label>
            <button className="btn p perigo" style={{ alignSelf: 'flex-start' }}>Excluir definitivamente</button>
          </form>
        )}
      </div>
    </>
  );
}
