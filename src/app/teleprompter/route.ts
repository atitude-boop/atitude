import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { registraAcesso } from '@/lib/auth';
import { exigeAcesso } from '@/lib/produtos';

export const dynamic = 'force-dynamic';

// Botão para voltar ao app, colocado na barra do topo da tela inicial do teleprompter.
const MARCA = '<button class="pillbtn" id="editBtn">Editar</button>';
const VOLTAR = '<a class="pillbtn" href="/" style="text-decoration:none;color:inherit;font-size:16px;padding:0 16px">‹ Atitude</a>';

let cache: string | null = null;
async function pagina() {
  if (!cache) {
    const html = await readFile(path.join(process.cwd(), 'conteudo', 'teleprompter.html'), 'utf8');
    cache = html.includes(MARCA) ? html.replace(MARCA, MARCA + VOLTAR) : html;
  }
  return cache;
}

// O teleprompter é um aplicativo completo em um arquivo só (conteudo/teleprompter.html).
// Ele só é entregue a quem está logado e tem o aplicativo liberado.
export async function GET() {
  await registraAcesso(await exigeAcesso('teleprompter'));
  return new Response(await pagina(), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store' },
  });
}
