'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcoInicio, IcoJornada, IcoPerfil, IcoPlano } from './Icones';

const ITENS = [
  { href: '/', rotulo: 'Início', Ico: IcoInicio, casa: (p: string) => p === '/' },
  { href: '/jornada', rotulo: 'Jornada', Ico: IcoJornada, casa: (p: string) => p.startsWith('/jornada') },
  { href: '/plano', rotulo: 'Plano', Ico: IcoPlano, casa: (p: string) => p.startsWith('/plano') },
  { href: '/perfil', rotulo: 'Perfil', Ico: IcoPerfil, casa: (p: string) => p.startsWith('/perfil') || p.startsWith('/cadastro') },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Navegação">
      <div>
        {ITENS.map(({ href, rotulo, Ico, casa }) => (
          <Link key={href} href={href} aria-current={casa(path) ? 'page' : undefined}>
            <Ico />
            <span>{rotulo}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
