import type { Metadata } from 'next';
import PerfilTela from '@/components/PerfilTela';
import { exigeAluno } from '@/lib/auth';

export const metadata: Metadata = { title: 'Perfil' };

export default async function Perfil({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const aluno = await exigeAluno();
  return <PerfilTela aluno={aluno} salvo={(await searchParams).salvo === '1'} />;
}
