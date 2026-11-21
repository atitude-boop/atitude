import type { Metadata } from 'next';
import Link from 'next/link';
import { exigeAluno } from '@/lib/auth';
import { acessosDe } from '@/lib/produtos';
import { IcoClub, IcoSeta, IcoVoltar } from '@/components/Icones';

export const metadata: Metadata = { title: 'Atitude Club' };

export default async function Club() {
  const aluno = await exigeAluno();
  const tem = (await acessosDe(aluno.id, aluno.papel)).has('club');
  return (
    <>
      <div className="topo">
        <Link href="/" className="voltar" aria-label="Voltar para o início"><IcoVoltar /></Link>
        <div className="txt">
          <span className="rot">Atitude Educação</span>
          <h1 className="titulo m">Atitude Club</h1>
        </div>
      </div>
      <div className="card hi">
        <span className="quad"><IcoClub /></span>
        <span className="h" style={{ fontSize: 18, fontWeight: 600 }}>
          {tem ? 'Você faz parte do Atitude Club' : 'O programa principal do grupo'}
        </span>
        <span className="mut" style={{ fontSize: 14 }}>
          {tem
            ? 'A área do Club dentro do app está sendo preparada. Enquanto isso, o seu acesso já libera todas as formações disponíveis.'
            : 'O Atitude Club dá acesso a tudo o que a Atitude Educação oferece. Ele não está incluso no seu acesso atual. Fale com a equipe da escola para conhecer.'}
        </span>
      </div>
      {tem && (
        <Link href="/oratoria" className="card">
          <div className="linha">
            <div className="cresce">
              <span style={{ fontWeight: 600 }}>Formação de Oratória</span>
              <span className="mut" style={{ fontSize: 12.5 }}>Incluída no seu Atitude Club</span>
            </div>
            <IcoSeta />
          </div>
        </Link>
      )}
    </>
  );
}
