// Produtos do grupo Atitude Educação que aparecem na tela de entrada do app.
export const PRODUTOS = [
  { id: 'club', nome: 'Atitude Club', resumo: 'O programa principal do grupo, com acesso a tudo.', rota: '/club' },
  { id: 'oratoria', nome: 'Formação de Oratória', resumo: 'Encontros semanais e presenciais.', rota: '/oratoria' },
] as const;

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
