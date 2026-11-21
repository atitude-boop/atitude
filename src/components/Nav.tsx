'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcoAgenda, IcoInicio, IcoJornada, IcoMicrofone, IcoPerfil } from './Icones';

const R = '/oratoria';
const ITENS = [
  { href: R, rotulo: 'Início', Ico: IcoInicio, casa: (p: string) => p === R },
  { href: `${R}/jornada`, rotulo: 'Jornada', Ico: IcoJornada, casa: (p: string) => p.startsWith(`${R}/jornada`) },
  { href: `${R}/treinar`, rotulo: 'Treinar', Ico: IcoMicrofone, casa: (p: string) => p.startsWith(`${R}/treinar`) || p.startsWith(`${R}/plano`) },
  { href: `${R}/agenda`, rotulo: 'Agenda', Ico: IcoAgenda, casa: (p: string) => p.startsWith(`${R}/agenda`) },
  { href: `${R}/perfil`, rotulo: 'Perfil', Ico: IcoPerfil, casa: (p: string) => p.startsWith(`${R}/perfil`) },
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
