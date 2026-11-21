import Link from 'next/link';
import { exigeAluno } from '@/lib/auth';
import { type Bonus, PRODUTOS } from '@/lib/catalogo';
import { db } from '@/lib/db';
import { saudacao } from '@/lib/datas';
import { acessosDe } from '@/lib/produtos';
import { IcoCadeado, IcoClub, IcoMicrofone, IcoPerfil, IcoPresente, IcoSeta } from '@/components/Icones';

const ICONE = { club: IcoClub, oratoria: IcoMicrofone };

export default async function Grupo() {
  const aluno = await exigeAluno();
  const [acessos, bonus] = await Promise.all([
    acessosDe(aluno.id, aluno.papel),
    db()<Bonus[]>`select id, titulo, detalhe, url from bonus where aluno_id = ${aluno.id} order by criado_em`,
  ]);
  const primeiroNome = aluno.nome.trim().split(/\s+/)[0];

  return (
    <>
      <div className="topo" style={{ justifyContent: 'space-between' }}>
        <div className="txt">
          <span className="rot">Atitude Educação</span>
          <h1 className="titulo">{saudacao()}, {primeiroNome}</h1>
        </div>
        <Link href="/perfil" className="voltar" aria-label="Abrir o seu perfil"><IcoPerfil /></Link>
      </div>
      <p className="mut" style={{ fontSize: 14 }}>
        {acessos.size > 0 ? 'Escolha por onde quer continuar.' : 'O seu acesso ainda não foi liberado. Fale com a equipe da escola.'}
      </p>

      <div className="produtos">
        {PRODUTOS.map((p) => {
          const Ico = ICONE[p.id];
          const tem = acessos.has(p.id);
          return (
            <Link key={p.id} href={p.rota} className={`produto${tem ? ' meu' : ''}`}>
              <span className="quad"><Ico /></span>
              <span className="cresce">
                <span className="h" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>{p.nome}</span>
                <span className="mut" style={{ fontSize: 12.5 }}>{p.resumo}</span>
              </span>
              {tem
                ? <span className="chip" style={{ alignSelf: 'flex-start' }}>Entrar <IcoSeta size={13} /></span>
                : <span className="chip trancado" style={{ alignSelf: 'flex-start' }}><IcoCadeado size={13} /> Não incluso</span>}
            </Link>
          );
        })}
      </div>

      {bonus.length > 0 && (
        <>
          <h2 className="sec">Você também recebeu</h2>
          {bonus.map((b) => {
            const miolo = (
              <>
                <span className="ouro" style={{ display: 'flex', flexShrink: 0 }}><IcoPresente /></span>
                <span className="cresce">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{b.titulo}</span>
                  {b.detalhe && <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--mut)' }}>{b.detalhe}</span>}
                </span>
                {b.url && <span className="ouro" style={{ fontSize: 12.5, fontWeight: 600 }}>Abrir</span>}
              </>
            );
            return b.url
              ? <a key={b.id} className="aviso bonus" href={b.url} target="_blank" rel="noopener noreferrer">{miolo}</a>
              : <div key={b.id} className="aviso bonus">{miolo}</div>;
          })}
        </>
      )}
    </>
  );
}
