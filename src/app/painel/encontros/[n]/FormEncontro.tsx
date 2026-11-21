'use client';
import { useActionState } from 'react';
import type { Anexo, Encontro } from '@/lib/db';
import { salvarEncontro, type EstadoEncontro } from '../../actions';

const texto = (l: Anexo[]) => l.map((x) => `${x.nome} | ${x.url}`).join('\n');

export default function FormEncontro({ e }: { e: Encontro }) {
  const [estado, acao, enviando] = useActionState<EstadoEncontro, FormData>(salvarEncontro, {});
  const v = estado.v ?? {
    titulo: e.titulo, data: e.data ?? '', objetivo: e.objetivo, pratica: e.pratica, tarefa: e.tarefa,
    video_url: e.video_url, materiais: texto(e.materiais), links: texto(e.links),
  };
  return (
    <form action={acao} className="card" style={{ gap: 16 }}>
      <input type="hidden" name="numero" value={e.numero} />
      <div key={estado.n ?? 0} style={{ display: 'contents' }}>
      <div className="form-grade">
        <div className="campo"><label htmlFor="titulo">Título</label><input id="titulo" name="titulo" type="text" defaultValue={v.titulo} maxLength={100} required /></div>
        <div className="campo">
          <label htmlFor="data">Data do encontro</label>
          <input id="data" name="data" type="date" defaultValue={v.data} />
          <span className="dica">Com data, o aluno só consegue marcar presença a partir desse dia. Sem data, pode marcar a qualquer momento.</span>
        </div>
      </div>
      <div className="campo"><label htmlFor="objetivo">Objetivo</label><textarea id="objetivo" name="objetivo" defaultValue={v.objetivo} maxLength={2000} /></div>
      <div className="campo"><label htmlFor="pratica">O que vamos praticar</label><textarea id="pratica" name="pratica" defaultValue={v.pratica} maxLength={2000} /></div>
      <div className="campo"><label htmlFor="tarefa">Tarefa para casa</label><textarea id="tarefa" name="tarefa" defaultValue={v.tarefa} maxLength={2000} /></div>
      <div className="campo">
        <label htmlFor="video_url">Link da aula gravada (YouTube)</label>
        <input id="video_url" name="video_url" type="url" defaultValue={v.video_url} maxLength={500} placeholder="https://youtu.be/..." />
      </div>
      <div className="campo">
        <label htmlFor="materiais">Materiais para baixar</label>
        <textarea id="materiais" name="materiais" defaultValue={v.materiais} placeholder={'Slides do encontro | https://drive.google.com/...\nExercício para casa | https://drive.google.com/...'} />
        <span className="dica">Um por linha, no formato: Nome | link. Use o link de compartilhamento do Google Drive ou de onde o arquivo estiver.</span>
      </div>
      <div className="campo">
        <label htmlFor="links">Links</label>
        <textarea id="links" name="links" defaultValue={v.links} placeholder={'Gravação do encontro prático | https://youtu.be/...'} />
        <span className="dica">Um por linha, no formato: Nome | link.</span>
      </div>
      </div>
      {estado.erro && <div className="aviso erro" role="alert">{estado.erro}</div>}
      {estado.ok && !enviando && <div className="aviso" role="status">Encontro salvo. Os alunos já veem o conteúdo novo.</div>}
      <button className="btn" style={{ alignSelf: 'flex-start', width: 'auto' }} disabled={enviando}>{enviando ? 'Salvando…' : 'Salvar encontro'}</button>
    </form>
  );
}
