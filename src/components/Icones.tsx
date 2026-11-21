type P = { d: string; size?: number; sw?: number };
const I = ({ d, size = 20, sw = 1.8 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
type S = { size?: number };
export const IcoVoltar = (p: S) => <I d="M15 5l-7 7 7 7" {...p} />;
export const IcoSeta = (p: S) => <I d="M9 5l7 7-7 7" size={16} {...p} />;
export const IcoCheck = ({ size = 14 }: S) => <I d="M5 12l5 5 9-10" size={size} sw={2.6} />;
export const IcoInicio = (p: S) => <I d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" size={22} {...p} />;
export const IcoJornada = (p: S) => <I d="M5 20h4v-5H5zM10 20h4V9h-4zM15 20h4V4h-4z" size={22} {...p} />;
export const IcoPlano = (p: S) => <I d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" size={22} {...p} />;
export const IcoPerfil = (p: S) => <I d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" size={22} {...p} />;
export const IcoPlay = ({ size = 22 }: S) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
export const IcoArquivo = (p: S) => <I d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6" {...p} />;
export const IcoLink = (p: S) => <I d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" {...p} />;
export const IcoCadeado = (p: S) => <I d="M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V7a4 4 0 0 1 8 0v4" {...p} />;
export const IcoGrupo = (p: S) => <I d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" size={22} {...p} />;
export const IcoClub = (p: S) => <I d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z" size={22} {...p} />;
export const IcoMicrofone = (p: S) => <I d="M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3" size={22} {...p} />;
export const IcoPresente = (p: S) => <I d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S9.500 7 12 7zm0 0c1.500-3 5-3.500 5-1.500S14.500 7 12 7z" {...p} />;
