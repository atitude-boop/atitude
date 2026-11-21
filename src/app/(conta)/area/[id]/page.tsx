import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigeAluno } from '@/lib/auth';
import { PRODUTOS } from '@/lib/catalogo';
import { acessosDe } from '@/lib/produtos';
import { IcoCadeado, IcoVoltar } from '@/components/Icones';

export const metadata: Metadata = { title: 'Atitude Educação' };

// Áreas que já aparecem na entrada do app mas ainda não têm conteúdo próprio.
export default async function Area({ params }: { params: Promise<{ id: string }> }) {
  const aluno = await exigeAluno();
  const { id } = await params;
  const p = PRODUTOS.find((x) => x.rota === `/area/${id}`);
  if (!p) notFound();
  const tem = (await acessosDe(aluno.id, aluno.papel)).has(p.id);
  return (
    <>
      <div className="topo">
        <Link href="/" className="voltar" aria-label="Voltar para o início"><IcoVoltar /></Link>
        <div className="txt">
          <span className="rot">{p.tipo === 'app' ? 'Nossos aplicativos' : 'Atitude Educação'}</span>
          <h1 className="titulo m">{p.nome}</h1>
        </div>
      </div>
      <div className="card hi">
        {!tem && <span className="quad"><IcoCadeado /></span>}
        <span className="h" style={{ fontSize: 18, fontWeight: 600 }}>{tem ? 'Em preparação' : 'Não incluso no seu acesso'}</span>
        {p.resumo && <span style={{ fontSize: 14 }}>{p.resumo}</span>}
        <span className="mut" style={{ fontSize: 14 }}>
          {tem
            ? 'O seu acesso já está garantido. Esta área está sendo preparada e aparece aqui assim que for liberada.'
            : 'Fale com a equipe da escola para conhecer e liberar o seu acesso.'}
        </span>
      </div>
    </>
  );
}
