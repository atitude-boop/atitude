'use client';
import { useActionState } from 'react';
import { gerarNovoCodigo, type EstadoCodigo } from '../../actions';
import CartaoAcesso from '../../CartaoAcesso';

export default function NovoCodigo({ id }: { id: string }) {
  const [estado, acao, enviando] = useActionState<EstadoCodigo, FormData>(gerarNovoCodigo, {});
  return (
    <div className="card">
      <h2 className="sec">Código de acesso</h2>
      <span className="mut" style={{ fontSize: 14 }}>
        Se o aluno perdeu o código, gere um novo. O antigo deixa de funcionar e ele precisará entrar de novo nos aparelhos em que já usava o app.
      </span>
      <form action={acao}>
        <input type="hidden" name="id" value={id} />
        <button className="btn p sec2" disabled={enviando}>{enviando ? 'Gerando…' : 'Gerar novo código'}</button>
      </form>
      {estado.acesso && (
        <div role="status">
          <div className="aviso">Novo código gerado. Envie agora: ele não aparece de novo.</div>
          <CartaoAcesso acesso={estado.acesso} url={estado.url ?? ''} />
        </div>
      )}
    </div>
  );
}
