// Datas no fuso de Brasília. Dias são tratados como texto 'AAAA-MM-DD'.
const FUSO = 'America/Sao_Paulo';
const SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DIA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const utc = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d));
};

export function hojeISO(agora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora);
}

export function dataValida(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = utc(iso);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

export function somaDias(iso: string, n: number) {
  const d = utc(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function difDias(a: string, b: string) {
  return Math.round((utc(a).getTime() - utc(b).getTime()) / 86400000);
}

export const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7);
export const semana = (iso: string) => SEM[utc(iso).getUTCDay()];
export function dataLonga(iso: string) {
  const d = utc(iso);
  return `${DIA[d.getUTCDay()]}, ${d.getUTCDate()} de ${MES[d.getUTCMonth()]}`;
}

export function dataHora(d: Date) {
  const p = new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const v = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  return `${v('day')}/${v('month')} às ${v('hour')}:${v('minute')}`;
}

export function haQuantosDias(d: Date | null, agora = new Date()) {
  if (!d) return null;
  return difDias(hojeISO(agora), hojeISO(d));
}

export function saudacao(agora = new Date()) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: FUSO, hour: '2-digit', hour12: false }).format(agora));
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

export function textoAcesso(d: Date | null) {
  const n = haQuantosDias(d);
  return n === null ? 'Nunca entrou' : n === 0 ? 'Hoje' : n === 1 ? 'Ontem' : `Há ${n} dias`;
}
