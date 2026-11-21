'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { DURACOES, TIPOS } from '@/lib/plano';
import { salvarPlano, type EstadoPlano } from './actions';

type Props = { hoje: string; inicial: { nome: string; tipo: string; duracao: string; data: string } | null };

export default function FormPlano({ hoje, inicial }: Props) {
  const [estado, acao, enviando] = useActionState<EstadoPlano, FormData>(salvarPlano, {});
  const v = estado.v ?? inicial;
  return (
    <form action={acao} className="card" style={{ gap: 16 }}>
      <div key={estado.n ?? 0} style={{ display: 'contents' }}>
      <span className="mut" style={{ fontSize: 14 }}>Conte o que você vai apresentar e quando. O app monta um treino por dia até a data.</span>
      <div className="campo">
        <label htmlFor="nome">O que você vai apresentar</label>
        <input id="nome" name="nome" type="text" maxLength={60} defaultValue={v?.nome ?? ''} placeholder="Ex.: Pitch para investidores" />
      </div>
      <fieldset className="campo">
        <legend>Tipo</legend>
        <div className="opcoes">
          {TIPOS.map((t, i) => (
            <label key={t}><input type="radio" name="tipo" value={t} defaultChecked={v?.tipo ? v.tipo === t : i === 0} /><span>{t}</span></label>
          ))}
        </div>
      </fieldset>
      <fieldset className="campo">
        <legend>Quanto tempo você terá</legend>
        <div className="opcoes">
          {DURACOES.map((t, i) => (
            <label key={t}><input type="radio" name="duracao" value={t} defaultChecked={v?.duracao ? v.duracao === t : i === 1} /><span>{t}</span></label>
          ))}
        </div>
      </fieldset>
      <div className="campo">
        <label htmlFor="data">Data da apresentação</label>
        <input id="data" name="data" type="date" min={hoje} required defaultValue={v?.data ?? ''} />
        {inicial && <span className="dica">Se você mudar a data, o plano recomeça a partir de hoje.</span>}
      </div>
      </div>
      {estado.erro && <p className="erro" role="alert">{estado.erro}</p>}
      <button className="btn" disabled={enviando}>{enviando ? 'Montando…' : inicial ? 'Salvar plano' : 'Montar meu plano'}</button>
      {inicial && <Link href="/plano" className="btn fantasma">Cancelar</Link>}
    </form>
  );
}
