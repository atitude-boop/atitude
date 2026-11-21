export const COLABORADORES = ['Só eu', '2–10', '11–50', '51–200', '200+'];
export const FATURAMENTOS = ['Até R$ 10 mil/mês', 'R$ 10–50 mil/mês', 'R$ 50–200 mil/mês', 'R$ 200 mil–1 milhão/mês', 'Acima de R$ 1 milhão/mês', 'Prefiro não informar'];

// Link do WhatsApp com mensagem pronta. Devolve null se o número não parecer válido.
export function linkWhats(numero: string, texto: string) {
  let d = numero.replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) d = '55' + d;
  if (d.length < 12 || d.length > 13) return null;
  return `https://wa.me/${d}?text=${encodeURIComponent(texto)}`;
}

export function mensagemAcesso(nome: string, email: string, codigo: string, url: string) {
  return `Olá, ${nome.trim().split(/\s+/)[0]}! Seu acesso ao App do Aluno Atitude está liberado.\n\nEntre em: ${url}\nE-mail: ${email}\nCódigo de acesso: ${codigo}\n\nGuarde esta mensagem. O código é pessoal.`;
}
