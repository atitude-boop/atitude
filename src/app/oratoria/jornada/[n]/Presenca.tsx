'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { confirmarPresenca } from '../actions';
import { IcoCheck } from '@/components/Icones';

type Props = { numero: number; titulo: string; confirmadaEm: string | null; abreEm: string | null };

export default function Presenca({ numero, titulo, confirmadaEm, abreEm }: Props) {
  const [aberto, setAberto] = useState(false);
  const [acabou, setAcabou] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, iniciar] = useTransition();
  const sim = useRef<HTMLButtonElement>(null);
  const n = String(numero).padStart(2, '0');

  useEffect(() => {
    if (!aberto) return;
    sim.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [aberto]);

  const confirmar = () => iniciar(async () => {
    const r = await confirmarPresenca(numero);
    setAberto(false);
    if (r.ok) setAcabou(true); else setErro(r.erro ?? 'Não foi possível confirmar. Tente de novo.');
  });

  if (confirmadaEm) {
    return (
      <>
        {acabou && <div className="aviso" role="status"><IcoCheck size={18} /> Presença confirmada e salva no seu histórico</div>}
        <div className="btn sec2" style={{ cursor: 'default' }}><IcoCheck size={18} /> Presença confirmada · {confirmadaEm}</div>
      </>
    );
  }
  if (abreEm) return <div className="btn fantasma" style={{ cursor: 'default' }}>Presença disponível a partir de {abreEm}</div>;

  return (
    <>
      {erro && <div className="aviso erro" role="alert">{erro}</div>}
      <button className="btn" onClick={() => { setErro(''); setAberto(true); }}>Marcar presença neste encontro</button>
      {aberto && (
        <div className="fundo-dialogo" onClick={(e) => { if (e.target === e.currentTarget && !enviando) setAberto(false); }}>
          <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
            <div className="quad" style={{ width: 52, height: 52, borderRadius: '50%' }}><IcoCheck size={24} /></div>
            <span id="dlg-titulo" className="h" style={{ fontSize: 19, fontWeight: 700 }}>Confirmar presença no Encontro {n}?</span>
            <span className="mut" style={{ fontSize: 14 }}>
              “{titulo}” vai para o seu histórico com a data de hoje e passa a contar para o seu certificado. Depois de confirmada, a presença não pode ser desfeita.
            </span>
            <button ref={sim} className="btn" onClick={confirmar} disabled={enviando}>{enviando ? 'Confirmando…' : 'Sim, confirmar presença'}</button>
            <button className="btn fantasma" onClick={() => setAberto(false)} disabled={enviando}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}
