import { difDias, somaDias } from './datas';

// Desafios de 60 segundos. Um por dia, na ordem, voltando ao primeiro no fim da lista.
export const DESAFIOS = [
  'Apresente o seu negócio como se estivesse diante de um investidor.',
  'Conte em um minuto por que você faz o que faz.',
  'Explique o seu produto para uma criança de 10 anos.',
  'Abra uma apresentação com uma pergunta que prenda a atenção.',
  'Conte uma história de um cliente que você ajudou.',
  'Responda: por que alguém deveria comprar de você, e não do concorrente?',
  'Dê uma notícia difícil para a sua equipe, com firmeza e respeito.',
  'Apresente-se em um evento de negócios, sem dizer o seu cargo.',
  'Defenda uma ideia em que você acredita, em três argumentos.',
  'Feche uma venda: diga o próximo passo com clareza.',
  'Fale sobre um erro que te ensinou algo, sem se vitimizar.',
  'Convide alguém para conhecer a sua empresa.',
  'Explique um número importante do seu negócio e o que ele significa.',
  'Grave um vídeo de 60 segundos para as suas redes sobre o que você vende.',
];

export function desafioDoDia(hoje: string) {
  const n = difDias(hoje, '2026-01-01');
  return DESAFIOS[((n % DESAFIOS.length) + DESAFIOS.length) % DESAFIOS.length];
}

// Nível de orador: sobe com o total de desafios feitos.
export const NIVEIS = [
  { nome: 'Primeira Fala', de: 0 },
  { nome: 'Voz em Treino', de: 3 },
  { nome: 'Comunicador Confiante', de: 10 },
  { nome: 'Orador de Impacto', de: 25 },
  { nome: 'Orador Atitude', de: 50 },
];

export function nivelDe(total: number) {
  let i = 0;
  while (i + 1 < NIVEIS.length && total >= NIVEIS[i + 1].de) i++;
  const prox = NIVEIS[i + 1] ?? null;
  const base = NIVEIS[i].de;
  return {
    numero: i + 1,
    nome: NIVEIS[i].nome,
    proximo: prox?.nome ?? null,
    faltam: prox ? prox.de - total : 0,
    pct: prox ? Math.round(((total - base) / (prox.de - base)) * 100) : 100,
  };
}

// Dias seguidos treinando, contando até hoje (ou até ontem, se hoje ainda não treinou).
export function sequencia(dias: string[], hoje: string) {
  const feitos = new Set(dias);
  let d = feitos.has(hoje) ? hoje : somaDias(hoje, -1);
  let n = 0;
  while (feitos.has(d)) { n++; d = somaDias(d, -1); }
  return n;
}
