import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { alunoAtual } from '@/lib/auth';
import FormEntrar from './FormEntrar';

export const metadata: Metadata = { title: 'Entrar' };

export default async function Entrar() {
  if (await alunoAtual()) redirect('/');
  return (
    <main className="tela sem-nav" style={{ justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
        <span className="rot">Atitude · Escola de Oratória e Negócios</span>
        <h1 className="titulo">App do Aluno</h1>
        <p className="mut" style={{ fontSize: 14 }}>Entre com o e-mail da sua matrícula e o código que você recebeu.</p>
      </div>
      <FormEntrar />
      <p className="mut" style={{ fontSize: 12.5 }}>Não recebeu ou perdeu o código? Peça um novo para a equipe da escola.</p>
    </main>
  );
}
