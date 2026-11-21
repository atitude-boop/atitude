import type { Metadata } from 'next';
import Link from 'next/link';
import { cadastroPct, db, type Aluno } from '@/lib/db';
import { haQuantosDias, textoAcesso } from '@/lib/datas';
import FormAlunos from './FormAlunos';

export const metadata: Metadata = { title: 'Alunos' };

export default async function Alunos() {
  const sql = db();
  const alunos = await sql<(Aluno & { presencas: number })[]>`
    select a.*, (select count(*)::int from presencas p where p.aluno_id = a.id) as presencas
    from alunos a order by a.papel, a.turma, a.nome`;
  return (
    <>
      <FormAlunos />
      <div className="card">
        <h2 className="sec">Todos os acessos ({alunos.length})</h2>
        <div className="rolagem">
          <table>
            <thead><tr><th>Nome</th><th>Turma</th><th>Último acesso</th><th className="n">Presenças</th><th className="n">Cadastro</th></tr></thead>
            <tbody>
              {alunos.map((a) => {
                const dias = haQuantosDias(a.ultimo_acesso);
                return (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/painel/alunos/${a.id}`} style={{ fontWeight: 600, textDecoration: 'none' }}>{a.nome}</Link>
                      {a.papel === 'equipe' && <span className="chip" style={{ marginLeft: 8 }}>Equipe</span>}
                      <div className="mut" style={{ fontSize: 12.5 }}>{a.email}</div>
                    </td>
                    <td>{a.turma || '—'}</td>
                    <td style={dias === null || dias >= 14 ? { color: 'var(--err)' } : undefined}>{textoAcesso(a.ultimo_acesso)}</td>
                    <td className="n">{a.presencas} de 11</td>
                    <td className="n">{cadastroPct(a)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
