'use client';
import { useActionState } from 'react';
import { type Bonus, PRODUTOS } from '@/lib/catalogo';
import { adicionarBonus, type EstadoBonus, removerBonus, salvarAcessos } from '../../actions';

type Props = { id: string; equipe: boolean; acessos: string[]; bonus: Bonus[] };

export default function AcessosBonus({ id, equipe, acessos, bonus }: Props) {
  const [estado, acao, enviando] = useActionState<EstadoBonus, FormData>(adicionarBonus, {});
  return (
    <div className="duas">
      <form action={salvarAcessos} className="card" style={{ gap: 14 }}>
        <h2 className="sec">O que este aluno acessa</h2>
        <input type="hidden" name="id" value={id} />
        {equipe ? (
          <span className="mut" style={{ fontSize: 14 }}>Quem é da equipe abre todos os produtos.</span>
        ) : (
          <>
            {PRODUTOS.map((p) => (
              <label key={p.id} className="check" style={{ alignItems: 'center', minHeight: 40 }}>
                <input type="checkbox" name="produto" value={p.id} defaultChecked={acessos.includes(p.id)} />
                <span><b style={{ fontWeight: 600 }}>{p.nome}</b><br /><span className="mut" style={{ fontSize: 13 }}>{p.resumo}</span></span>
              </label>
            ))}
            <span className="mut" style={{ fontSize: 13 }}>Sem nenhum produto marcado, o aluno entra no app mas não abre nenhuma área.</span>
            <button className="btn p sec2" style={{ alignSelf: 'flex-start' }}>Salvar acessos</button>
          </>
        )}
      </form>

      <div className="card" style={{ gap: 14 }}>
        <h2 className="sec">Bônus recebidos</h2>
        {bonus.length === 0 ? <span className="mut" style={{ fontSize: 14 }}>Nenhum bônus cadastrado para este aluno.</span> : bonus.map((b) => (
          <div key={b.id} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--line2)' }}>
            <div className="cresce">
              <span style={{ fontWeight: 600 }}>{b.titulo}</span>
              {(b.detalhe || b.url) && <span className="mut" style={{ fontSize: 13, overflowWrap: 'anywhere' }}>{[b.detalhe, b.url].filter(Boolean).join(' · ')}</span>}
            </div>
            <form action={removerBonus}>
              <input type="hidden" name="bonus_id" value={b.id} />
              <button className="btn p perigo" aria-label={`Remover o bônus ${b.titulo}`}>Remover</button>
            </form>
          </div>
        ))}
        <form action={acao} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="hidden" name="id" value={id} />
          <div className="campo">
            <label htmlFor="bonus">Adicionar bônus</label>
            <textarea id="bonus" name="bonus" rows={2} key={estado.n ?? 0} defaultValue={estado.texto ?? ''} placeholder="Workshop de Vendas | 12/12, no Espaço Atitude" required />
            <span className="dica">Um por linha: Título | detalhe ou link. Aparece como aviso na entrada do app do aluno.</span>
          </div>
          {estado.erro && <p className="erro" role="alert">{estado.erro}</p>}
          <button className="btn p sec2" style={{ alignSelf: 'flex-start' }} disabled={enviando}>{enviando ? 'Adicionando…' : 'Adicionar bônus'}</button>
        </form>
      </div>
    </div>
  );
}
