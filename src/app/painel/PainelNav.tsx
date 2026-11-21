'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITENS = [
  { href: '/painel', rotulo: 'Visão geral', casa: (p: string) => p === '/painel' },
  { href: '/painel/alunos', rotulo: 'Alunos', casa: (p: string) => p.startsWith('/painel/alunos') },
  { href: '/painel/encontros', rotulo: 'Conteúdo das aulas', casa: (p: string) => p.startsWith('/painel/encontros') },
];

export default function PainelNav() {
  const path = usePathname();
  return (
    <nav className="painel-nav" aria-label="Painel da escola">
      {ITENS.map((i) => <Link key={i.href} href={i.href} aria-current={i.casa(path) ? 'page' : undefined}>{i.rotulo}</Link>)}
      <Link href="/" style={{ marginLeft: 'auto', border: 0 }}>Voltar ao app</Link>
    </nav>
  );
}
