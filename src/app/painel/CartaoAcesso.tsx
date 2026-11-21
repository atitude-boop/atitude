'use client';
import { useState } from 'react';
import { linkWhats, mensagemAcesso } from '@/lib/opcoes';
import type { Acesso } from './actions';

export default function CartaoAcesso({ acesso, url }: { acesso: Acesso; url: string }) {
  const [copiado, setCopiado] = useState(false);
  const msg = mensagemAcesso(acesso.nome, acesso.email, acesso.codigo, url);
  const whats = linkWhats(acesso.whatsapp, msg);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(msg); setCopiado(true); setTimeout(() => setCopiado(false), 2500); } catch { setCopiado(false); }
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--line2)' }}>
      <div className="cresce" style={{ minWidth: 180 }}>
        <span style={{ fontWeight: 600 }}>{acesso.nome}</span>
        <span className="mut" style={{ fontSize: 13 }}>{acesso.email}</span>
      </div>
      <span className="codigo">{acesso.codigo}</span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {whats && <a className="btn p" href={whats} target="_blank" rel="noopener noreferrer">Enviar no WhatsApp</a>}
        <button type="button" className="btn p sec2" onClick={copiar}>{copiado ? 'Mensagem copiada' : 'Copiar mensagem'}</button>
      </div>
    </div>
  );
}
