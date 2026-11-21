import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, type Encontro } from '@/lib/db';
import FormEncontro from './FormEncontro';

export const metadata: Metadata = { title: 'Editar encontro' };

export default async function EditarEncontro({ params }: { params: Promise<{ n: string }> }) {
  const numero = Number((await params).n);
  if (!Number.isInteger(numero) || numero < 1 || numero > 11) notFound();
  const [e] = await db()<Encontro[]>`select * from encontros where numero = ${numero}`;
  if (!e) notFound();
  return (
    <>
      <div>
        <Link href="/painel/encontros" style={{ fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Todos os encontros</Link>
        <h1 className="titulo" style={{ marginTop: 4 }}>Encontro {String(numero).padStart(2, '0')}</h1>
      </div>
      <FormEncontro e={e} />
    </>
  );
}
