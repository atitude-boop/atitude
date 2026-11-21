import type { Metadata } from 'next';
import Link from 'next/link';
import { db, type Encontro } from '@/lib/db';
import { diaMes } from '@/lib/datas';

export const metadata: Metadata = { title: 'Conteúdo das aulas' };

export default async function Encontros() {
  const sql = db();
  const lista = await sql<(Encontro & { presentes: number })[]>`
    select e.*, (select count(*)::int from presencas p join alunos a on a.id = p.aluno_id where p.encontro = e.numero and a.papel = 'aluno') as presentes
    from encontros e order by e.numero`;
  return (
    <div className="card">
      <h2 className="sec">Os 11 encontros</h2>
      <span className="mut" style={{ fontSize: 14 }}>O que você escreve aqui aparece na Jornada de todos os alunos.</span>
      <div className="rolagem">
        <table>
          <thead><tr><th>Encontro</th><th>Data</th><th>Vídeo</th><th className="n">Materiais</th><th className="n">Links</th><th className="n">Presenças</th><th></th></tr></thead>
          <tbody>
            {lista.map((e) => (
              <tr key={e.numero}>
                <td><span className="mut">{String(e.numero).padStart(2, '0')}</span> <b style={{ fontWeight: 600 }}>{e.titulo}</b></td>
                <td>{e.data ? diaMes(e.data) : <span className="mut">Sem data</span>}</td>
                <td>{e.video_url ? 'Publicado' : <span className="mut">Falta</span>}</td>
                <td className="n">{e.materiais.length}</td>
                <td className="n">{e.links.length}</td>
                <td className="n">{e.presentes}</td>
                <td className="n"><Link href={`/painel/encontros/${e.numero}`} style={{ fontWeight: 600, textDecoration: 'none' }}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
