import type { Metadata } from 'next';
import Link from 'next/link';
import { exigeAluno } from '@/lib/auth';
import { cadastroPct, db } from '@/lib/db';
import { IcoSeta } from '@/components/Icones';
import { sair } from '@/app/entrar/actions';

export const metadata: Metadata = { title: 'Perfil' };

export default async function Perfil({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const aluno = await exigeAluno();
  const salvo = (await searchParams).salvo === '1';
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from presencas where aluno_id = ${aluno.id}`;
  const pct = cadastroPct(aluno);
  const sub = [aluno.cargo, aluno.empresa].filter(Boolean).join(' · ');

  return (
    <>
      <div className="topo">
        <div className="txt">
          <span className="sobre">{aluno.turma ? `Turma ${aluno.turma}` : 'Aluno Atitude'}</span>
          <h1 className="titulo">{aluno.nome}</h1>
          {sub && <span className="mut" style={{ fontSize: 14 }}>{sub}</span>}
        </div>
      </div>

      {salvo && <div className="aviso" role="status">Cadastro salvo.</div>}

      <Link href="/cadastro" className="card hi">
        <div className="entre">
          <span style={{ fontWeight: 600 }}>{pct === 100 ? 'Cadastro completo' : 'Complete o seu cadastro'}</span>
          <span className="chip">{pct}%</span>
        </div>
        <div className="bar" style={{ height: 6 }}><div style={{ width: `${pct}%` }} /></div>
        <span className="mut" style={{ fontSize: 13 }}>{pct === 100 ? 'Toque para revisar ou atualizar os seus dados.' : 'Conte sobre você e o seu negócio.'}</span>
      </Link>

      <div className="lista">
        <Link href="/jornada?aba=historico">
          <span className="cresce"><span className="t">Presenças confirmadas</span><span className="s">{n} de 11 encontros</span></span>
          <span className="mut" style={{ display: 'flex' }}><IcoSeta /></span>
        </Link>
        <Link href="/plano">
          <span className="cresce"><span className="t">Plano de apresentação</span><span className="s">Um treino por dia até a sua data</span></span>
          <span className="mut" style={{ display: 'flex' }}><IcoSeta /></span>
        </Link>
        {aluno.papel === 'equipe' && (
          <Link href="/painel">
            <span className="cresce"><span className="t" style={{ color: 'var(--gold-hi)' }}>Painel da escola</span><span className="s">Alunos, acessos e conteúdo das aulas</span></span>
            <span className="mut" style={{ display: 'flex' }}><IcoSeta /></span>
          </Link>
        )}
      </div>

      <div className="card">
        <span style={{ fontWeight: 600 }}>Coloque o app na tela do celular</span>
        <span className="mut" style={{ fontSize: 13.5 }}>
          No iPhone, abra pelo Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”. No Android, abra o menu do Chrome e toque em “Instalar app”.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="mut" style={{ fontSize: 12.5 }}>Você entrou como {aluno.email}</span>
        <form action={sair}><button className="btn fantasma">Sair do app</button></form>
      </div>
    </>
  );
}
