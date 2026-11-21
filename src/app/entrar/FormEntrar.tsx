'use client';
import { useActionState } from 'react';
import { entrar, type EstadoEntrar } from './actions';

export default function FormEntrar() {
  const [estado, acao, enviando] = useActionState<EstadoEntrar, FormData>(entrar, {});
  return (
    <form action={acao} className="card" style={{ gap: 16 }}>
      <div className="campo">
        <label htmlFor="email">Seu e-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required defaultValue={estado.email ?? ''} placeholder="voce@empresa.com" />
      </div>
      <div className="campo">
        <label htmlFor="codigo">Código de acesso</label>
        <input id="codigo" name="codigo" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} required placeholder="XXXX-XXXX" style={{ letterSpacing: '.08em' }} />
        <span className="dica">A escola enviou o seu código pelo WhatsApp.</span>
      </div>
      {estado.erro && <p className="erro" role="alert">{estado.erro}</p>}
      <button className="btn" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}
