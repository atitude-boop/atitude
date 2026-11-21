'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcoGrupo, IcoInicio, IcoJornada, IcoPlano } from './Icones';

const ITENS = [
  { href: '/', rotulo: 'Atitude', Ico: IcoGrupo, casa: () => false },
  { href: '/oratoria', rotulo: 'Início', Ico: IcoInicio, casa: (p: string) => p === '/oratoria' },
  { href: '/oratoria/jornada', rotulo: 'Jornada', Ico: IcoJornada, casa: (p: string) => p.startsWith('/oratoria/jornada') },
  { href: '/oratoria/plano', rotulo: 'Plano', Ico: IcoPlano, casa: (p: string) => p.startsWith('/oratoria/plano') },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Formação de Oratória">
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
