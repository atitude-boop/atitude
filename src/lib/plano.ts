import { diaMes, difDias, semana, somaDias } from './datas';

export const TIPOS = ['Pitch de vendas', 'Palestra', 'Reunião', 'Vídeo'];
export const DURACOES = ['1 min', '5 min', '15 min', '30 min ou mais'];
export const MAX_DIAS = 30;

const MEIO = [
  'Treino focado: 1 minuto sem “né”',
  'Grave o trecho do meio com os gestos na Zona P',
  'Ensaio de corpo inteiro: postura firme, sem balanço',
  'Responda em voz alta as 3 perguntas mais difíceis',
  'Grave olhando para a câmera, sem olhar para baixo',
  'Ensaio com pausas: 2 segundos antes de cada número',
];

export type Treino = {
  k: number; data: string; dia: string; sem: string; titulo: string; fase: string; min: number;
  feito: boolean; hoje: boolean; atrasado: boolean;
};

// O plano começa em `inicio` e nunca tem mais de 30 dias de treino.
export function inicioEfetivo(data: string, inicio: string) {
  const limite = somaDias(data, -MAX_DIAS);
  return difDias(inicio, limite) < 0 ? limite : inicio;
}

export function gerarPlano(p: { data: string; inicio: string; duracao: string; feitos: number[] }, hoje: string) {
  const ini = inicioEfetivo(p.data, p.inicio);
  const m = Math.max(0, difDias(p.data, ini));
  const treinos: Treino[] = [];
  for (let k = 0; k < m; k++) {
    const r = m - 1 - k;
    const d = somaDias(ini, k);
    let titulo: string, fase: string, min: number;
    if (r === 0) { titulo = 'Ensaio final leve e descanso da voz'; fase = 'Ensaio geral'; min = 10; }
    else if (r === 1) { titulo = 'Ensaio geral completo, cronometrado em ' + p.duracao; fase = 'Ensaio geral'; min = 20; }
    else if (r === 2) { titulo = 'Ensaio geral com a roupa, o microfone e os slides do dia'; fase = 'Ensaio geral'; min = 20; }
    else if (k === 0) { titulo = 'Escreva a mensagem central em uma frase e grave em 30s'; fase = 'Estrutura'; min = 5; }
    else if (k === 1) { titulo = 'Grave 3 versões da abertura e escolha a melhor'; fase = 'Estrutura'; min = 8; }
    else if (k === 2) { titulo = 'Grave o fechamento com a frase-chave, sem “é isso”'; fase = 'Estrutura'; min = 5; }
    else { titulo = MEIO[(k - 3) % MEIO.length]; fase = 'Ensaio por partes'; min = 6; }
    const off = difDias(d, hoje);
    const feito = p.feitos.includes(k);
    treinos.push({ k, data: d, dia: diaMes(d), sem: off === 0 ? 'hoje' : semana(d), titulo, fase, min, feito, hoje: off === 0, atrasado: off < 0 && !feito });
  }
  return {
    treinos,
    total: m,
    feitos: treinos.filter((t) => t.feito).length,
    faltam: difDias(p.data, hoje),
    cortado: ini !== p.inicio,
    inicio: ini,
  };
}
