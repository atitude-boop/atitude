# App do Aluno Atitude

App web instalável no celular para os alunos da Atitude Escola de Oratória e Negócios.
Esta é a primeira versão (MVP). A especificação completa do produto está em `docs/ESPECIFICACAO.md`.

## O que esta versão faz

**Aluno**
- Entra com o e-mail e um código de acesso pessoal, enviado pela escola no WhatsApp.
- Entrada do grupo Atitude Educação: os programas (Atitude Club, Formação de Oratória, Atitude Pés, Comunidade Atitude, Up Doctors) aparecem em quadros e, abaixo, a seção "Nossos aplicativos" (Teleprompter, Simulador de vendas, Análise de vídeo). Cada pessoa só abre o que comprou; o Atitude Club libera tudo. Aplicativos podem ser vendidos em separado.
- Teleprompter: roteiro, velocidade e tamanho da letra, ensaio e gravação com a câmera da frente, com o vídeo salvo no aparelho.
- Ainda sem conteúdo próprio (mostram "em preparação"): Atitude Club, Atitude Pés, Comunidade Atitude, Up Doctors, Simulador de vendas e Análise de vídeo.
- Bônus: outros treinamentos e materiais que o aluno recebeu aparecem como avisos nessa entrada.
- Formação de Oratória, Jornada: os 11 encontros com objetivo, prática, tarefa, aula gravada, materiais e links.
- Presença: confirma em cada encontro (não pode ser desfeita) e vê o histórico com data e hora.
- Plano de apresentação: informa uma apresentação e a data, e recebe um treino por dia até lá.
- Cadastro: dados públicos e dados que só a escola vê.

**Equipe da escola** (`/painel`)
- Cria os acessos da turma colando uma lista (Nome; e-mail; WhatsApp) e envia o código pelo WhatsApp.
- Define, na criação e depois aluno a aluno, quais produtos cada um acessa e quais bônus recebeu.
- Vê quem está ativo, quem está há 14 dias ou mais sem abrir o app e quem nunca entrou.
- Vê o cadastro completo, as presenças e a apresentação marcada de cada aluno.
- Gera um novo código para quem perdeu, corrige dados e exclui acessos.
- Edita o conteúdo e a data dos 11 encontros.

**Ainda não tem:** avaliação de vídeo por IA, treino focado, missões e pontos, agenda com QR, conexões entre alunos.

## Como colocar no ar (Vercel)

Você precisa de uma conta na [Vercel](https://vercel.com), entrando com o GitHub que tem este repositório.

1. Na Vercel, clique em **Add New → Project** e importe o repositório `atitude`.
2. Antes de clicar em Deploy, abra **Environment Variables** e crie três variáveis:
   - `EQUIPE_EMAIL`: o seu e-mail (será o primeiro usuário do painel).
   - `EQUIPE_NOME`: o seu nome.
   - `EQUIPE_CODIGO`: o seu código de acesso, com 8 ou mais letras e números. Não use um código óbvio.
3. Clique em **Deploy** e espere terminar. O app ainda não abre, porque falta o banco de dados.
4. No projeto, abra a aba **Storage**, clique em **Create Database**, escolha **Neon (Postgres)** e conecte ao projeto. O plano gratuito atende uma turma. A Vercel cria sozinha a variável `DATABASE_URL`.
5. Abra a aba **Deployments**, clique nos três pontos do último deploy e escolha **Redeploy**. Nesse passo o app cria as tabelas e o seu usuário.
6. Abra o endereço do projeto, entre com o seu e-mail e o `EQUIPE_CODIGO`, e vá em **Perfil → Painel da escola**.

Para usar um endereço próprio (por exemplo `app.suaescola.com`), adicione o domínio em **Settings → Domains** e siga as instruções de DNS.

Os nomes dos botões da Vercel podem mudar com o tempo. Se o banco criar a variável com outro nome, o app também aceita `POSTGRES_URL`.

## Liberar a primeira turma

1. No painel, abra **Conteúdo das aulas** e revise os 11 encontros: textos, data, link do YouTube, materiais.
2. Abra **Alunos**, cole a lista da turma, marque o que esses alunos compraram, escreva os bônus (se houver) e clique em **Criar acessos**.
   Quem comprou coisas diferentes entra em listas separadas, ou é ajustado depois na página do aluno.
3. Para cada aluno aparece o código e o botão **Enviar no WhatsApp**, com a mensagem pronta (endereço, e-mail e código).
   O código aparece uma única vez. Se alguém perder, gere outro na página do aluno.

## Segurança e privacidade

- O código de acesso é guardado embaralhado (não dá para ler no banco). Depois de 5 erros seguidos, o acesso fica bloqueado por 15 minutos.
- A sessão dura 90 dias no aparelho. Gerar um novo código desconecta os aparelhos antigos.
- O app guarda dados pessoais (WhatsApp, faturamento). Antes de liberar para os alunos, publique um termo de uso e privacidade e inclua o link no cadastro.

## Para quem for desenvolver

Next.js (App Router) + Postgres, sem serviços externos além do banco.

```bash
cp .env.example .env.local   # preencha DATABASE_URL e EQUIPE_*
npm install
npm run migrate
npm run dev
```

- `db/migrations/`: SQL aplicado em ordem por `scripts/migrate.mjs` (roda sozinho antes de cada build).
- `src/lib/`: banco (`db.ts`), login e sessão (`auth.ts`), datas no fuso de Brasília (`datas.ts`), regra do plano (`plano.ts`).
- `src/app/(conta)/`: entrada do grupo, Club, perfil e cadastro. `src/app/oratoria/`: Formação de Oratória. `src/app/painel/`: equipe. `src/app/entrar/`: login.
- `src/lib/catalogo.ts`: lista de produtos do grupo. Para criar um produto novo, acrescente ali e crie a pasta dele em `src/app/`.
