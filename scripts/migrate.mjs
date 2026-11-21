// Aplica as migrações em db/migrations e cria o primeiro usuário da equipe.
// Roda sozinho antes de cada build (npm run build) e pode ser chamado com: npm run migrate
import { readdirSync, readFileSync } from 'node:fs';
import { randomBytes, scryptSync } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.warn('[migrate] DATABASE_URL não definida: migrações puladas.');
  process.exit(0);
}

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations');
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

try {
  await sql`create table if not exists _migracoes (nome text primary key, aplicada_em timestamptz not null default now())`;
  const feitas = new Set((await sql`select nome from _migracoes`).map((r) => r.nome));
  for (const arquivo of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    if (feitas.has(arquivo)) continue;
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(join(dir, arquivo), 'utf8'));
      await tx`insert into _migracoes (nome) values (${arquivo})`;
    });
    console.log('[migrate] aplicada:', arquivo);
  }

  const email = (process.env.EQUIPE_EMAIL || '').trim().toLowerCase();
  const codigo = (process.env.EQUIPE_CODIGO || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (email && codigo) {
    if (codigo.length < 8) {
      console.warn('[migrate] EQUIPE_CODIGO precisa de pelo menos 8 letras ou números: usuário da equipe não criado.');
    } else {
      const salt = randomBytes(16);
      const hash = salt.toString('hex') + ':' + scryptSync(codigo, salt, 32).toString('hex');
      const nome = (process.env.EQUIPE_NOME || 'Equipe Atitude').trim();
      const r = await sql`
        insert into alunos (email, nome, papel, codigo_hash) values (${email}, ${nome}, 'equipe', ${hash})
        on conflict (email) do nothing returning id`;
      if (r.length) console.log('[migrate] usuário da equipe criado:', email);
    }
  }
} finally {
  await sql.end();
}
