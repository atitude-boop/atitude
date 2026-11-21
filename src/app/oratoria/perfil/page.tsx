import type { Metadata } from 'next';
import PerfilTela from '@/components/PerfilTela';
import { exigeAcesso } from '@/lib/produtos';

export const metadata: Metadata = { title: 'Perfil' };

export default async function PerfilOratoria() {
  const aluno = await exigeAcesso('oratoria');
  return <PerfilTela aluno={aluno} salvo={false} naOratoria />;
}
