'use client';
import { useActionState } from 'react';
import { adicionarAlunos, type EstadoAlunos } from '../actions';
import CartaoAcesso from '../CartaoAcesso';

export default function FormAlunos() {
  const [estado, acao, enviando] = useActionState<EstadoAlunos, FormData>(adicionarAlunos, {});
  return (
    <div className="card" style={{ gap: 14 }}>
      <h2 className="sec">Adicionar alunos</h2>
      <form action={acao} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="campo">
          <label htmlFor="lista">Um aluno por linha</label>
          <textarea id="lista" name="lista" rows={5} key={estado.texto ?? ''} defaultValue={estado.texto ?? ''} placeholder={'Nome completo; email@empresa.com; (62) 99999-0000\nOutro Aluno; outro@empresa.com; (62) 98888-0000'} required />
          <span className="dica">Formato: Nome; e-mail; WhatsApp. O WhatsApp é opcional. Dá para colar várias linhas de uma planilha.</span>
        </div>
        <div className="form-grade">
          <div className="campo">
            <label htmlFor="turma">Turma</label>
            <input id="turma" name="turma" type="text" maxLength={60} placeholder="Ex.: Novembro 2026" />
          </div>
          <label className="check" style={{ alignSelf: 'end', minHeight: 46, alignItems: 'center' }}>
            <input type="checkbox" name="equipe" />
            <span>São da equipe da escola (acessam este painel)</span>
          </label>
        </div>
        <button className="btn" style={{ alignSelf: 'flex-start', width: 'auto' }} disabled={enviando}>{enviando ? 'Criando acessos…' : 'Criar acessos'}</button>
      </form>

      {estado.erros && estado.erros.length > 0 && (
        <div className="aviso erro" role="alert" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          {estado.erros.map((e, i) => <span key={i}>{e}</span>)}
        </div>
      )}
      {estado.criados && estado.criados.length > 0 && (
        <div role="status">
          <div className="aviso" style={{ marginBottom: 6 }}>
            {estado.criados.length === 1 ? '1 acesso criado.' : `${estado.criados.length} acessos criados.`} Envie o código agora: ele não aparece de novo.
          </div>
          {estado.criados.map((a) => <CartaoAcesso key={a.email} acesso={a} url={estado.url ?? ''} />)}
        </div>
      )}
    </div>
  );
}
