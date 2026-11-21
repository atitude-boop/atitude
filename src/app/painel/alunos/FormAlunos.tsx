'use client';
import { useActionState } from 'react';
import { APPS, PRODUTOS, PROGRAMAS } from '@/lib/catalogo';
import { adicionarAlunos, type EstadoAlunos } from '../actions';
import CartaoAcesso from '../CartaoAcesso';

export default function FormAlunos() {
  const [estado, acao, enviando] = useActionState<EstadoAlunos, FormData>(adicionarAlunos, {});
  return (
    <div className="card" style={{ gap: 14 }}>
      <h2 className="sec">Adicionar alunos</h2>
      <form action={acao} key={estado.n ?? 0} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="campo">
          <label htmlFor="lista">Um aluno por linha</label>
          <textarea id="lista" name="lista" rows={5} defaultValue={estado.texto ?? ''} placeholder={'Nome completo; email@empresa.com; (62) 99999-0000\nOutro Aluno; outro@empresa.com; (62) 98888-0000'} required />
          <span className="dica">Formato: Nome; e-mail; WhatsApp. O WhatsApp é opcional. Dá para colar várias linhas de uma planilha.</span>
        </div>
        <fieldset className="campo">
          <legend>O que estes alunos compraram</legend>
          {[['Programas', PROGRAMAS], ['Aplicativos', APPS]].map(([rotulo, lista]) => (
            <div key={rotulo as string} style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', alignItems: 'center' }}>
              <span className="mut" style={{ fontSize: 12.5, width: 92 }}>{rotulo as string}</span>
              {(lista as typeof PRODUTOS[number][]).map((p) => (
                <label key={p.id} className="check" style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--fg)', fontWeight: 500, fontSize: 14, alignItems: 'center', minHeight: 40 }}>
                  <input type="checkbox" name="produto" value={p.id} defaultChecked={estado.produtos ? estado.produtos.includes(p.id) : p.id === 'oratoria'} />
                  <span>{p.nome}</span>
                </label>
              ))}
            </div>
          ))}
          <span className="dica">Cada pessoa só abre o que estiver marcado. O Atitude Club libera tudo, inclusive os aplicativos. Quem comprou só um aplicativo entra só com ele marcado.</span>
        </fieldset>
        <div className="campo">
          <label htmlFor="bonus">Bônus que receberam (opcional)</label>
          <textarea id="bonus" name="bonus" rows={2} defaultValue={estado.bonus ?? ''} placeholder={'Workshop de Vendas | 12/12, no Espaço Atitude\nE-book de roteiros | https://drive.google.com/...'} />
          <span className="dica">Um por linha: Título | detalhe ou link. Aparece como aviso na entrada do app de cada aluno desta lista.</span>
        </div>
        <div className="form-grade">
          <div className="campo">
            <label htmlFor="turma">Turma</label>
            <input id="turma" name="turma" type="text" maxLength={60} defaultValue={estado.turma ?? ''} placeholder="Ex.: Novembro 2026" />
          </div>
          <label className="check" style={{ alignSelf: 'end', minHeight: 46, alignItems: 'center' }}>
            <input type="checkbox" name="equipe" defaultChecked={estado.equipe ?? false} />
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
