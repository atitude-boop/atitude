// O que o grupo Atitude Educação oferece e aparece na tela de entrada: programas (quadros grandes) e aplicativos.
export const PRODUTOS = [
  { id: 'club', tipo: 'programa', nome: 'Atitude Club', resumo: 'O programa principal do grupo, com acesso a tudo.', rota: '/club' },
  { id: 'oratoria', tipo: 'programa', nome: 'Formação de Oratória', resumo: 'Encontros semanais e presenciais.', rota: '/oratoria' },
  { id: 'pass', tipo: 'programa', nome: 'Atitude Pass', resumo: '', rota: '/area/pass' },
  { id: 'comunidade', tipo: 'programa', nome: 'Comunidade Atitude', resumo: 'A rede de alunos da Atitude.', rota: '/area/comunidade' },
  { id: 'updoctors', tipo: 'programa', nome: 'Up Doctors', resumo: 'Programa de acelerador médico com Marcelo Rezende e Dr. Bruno Carvalho.', rota: '/area/updoctors' },
  // Aplicativos: vendidos também em separado, para quem não é aluno de um programa.
  { id: 'teleprompter', tipo: 'app', nome: 'Teleprompter', resumo: 'Roteiros, teleprompter com gravação e edição de vídeo.', rota: '/teleprompter' },
  { id: 'simulador', tipo: 'app', nome: 'Simulador de vendas', resumo: 'Treine a venda com um cliente difícil.', rota: '/area/simulador' },
  { id: 'analise', tipo: 'app', nome: 'Análise de vídeo', resumo: 'Envie um vídeo e receba o feedback da sua oratória.', rota: '/area/analise' },
] as const;

// Texto longo da página "Faça parte" de cada item, mostrado a quem ainda não tem acesso. Vazio = usa só o resumo.
export const SOBRE: Partial<Record<(typeof PRODUTOS)[number]['id'], string>> = {
  updoctors: '',
};

export const PROGRAMAS = PRODUTOS.filter((p) => p.tipo === 'programa');
export const APPS = PRODUTOS.filter((p) => p.tipo === 'app');

export type ProdutoId = (typeof PRODUTOS)[number]['id'];
export const ehProduto = (x: string): x is ProdutoId => PRODUTOS.some((p) => p.id === x);
export const nomeProduto = (id: string) => PRODUTOS.find((p) => p.id === id)?.nome ?? id;

export type Bonus = { id: string; titulo: string; detalhe: string; url: string };

// Lê bônus digitados um por linha: "Título | detalhe ou link". Devolve texto de erro se algum link for inválido.
export function lerBonus(texto: string): Omit<Bonus, 'id'>[] | string {
  const lista: Omit<Bonus, 'id'>[] = [];
  for (const linha of texto.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const [titulo = '', ...resto] = linha.split('|').map((p) => p.trim());
    if (!titulo) return `Bônus “${linha}”: falta o título antes da barra.`;
    let detalhe = '', url = '';
    for (const parte of resto) {
      if (/^https?:\/\/\S+$/i.test(parte)) url = parte;
      else if (/^\w+:/.test(parte) && !/\s/.test(parte)) return `Bônus “${titulo}”: o link precisa começar com https://`;
      else if (parte) detalhe = parte;
    }
    lista.push({ titulo: titulo.slice(0, 100), detalhe: detalhe.slice(0, 300), url: url.slice(0, 500) });
  }
  return lista;
}
