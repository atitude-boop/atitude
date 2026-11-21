# App do Aluno Atitude — Especificação para desenvolvimento

Este pacote tem o protótipo visual das telas (pasta `telas-prototipo/`) e esta especificação.
Use este documento como briefing no Claude Code: "Leia LEIA-ME_ESPECIFICACAO.md e os arquivos em telas-prototipo/ e construa o app".

> Os arquivos `.dc.html` são do formato de design do Claude (Design canvas). Eles NÃO rodam sozinhos no navegador: use-os como **referência de layout, textos, cores e fluxos**. O código final deve ser escrito do zero (ex.: React/Next.js ou React Native/Expo).

---

## 1. Visão geral

- **Para quem:** alunos da Atitude Escola de Oratória e Negócios (empresários e profissionais).
- **Objetivo:** o aluno treina todo dia, acompanha a jornada de 11 encontros, recebe avaliação de vídeo por IA e se conecta com outros alunos. A escola recebe dados para resgatar quem está sumindo e oferecer o próximo passo (Atitude Club, mentoria, B2B).
- **Plataformas:** começar como app web instalável (PWA), depois app nativo iPhone/Android.
- **Idioma:** português do Brasil.

## 2. Identidade visual

| Token | Valor |
|---|---|
| Fundo | `#0F0F12` |
| Cartão | `#1A1A1F` (borda `#2A2A31`, raio 18px) |
| Cartão destaque | `#1C1A15` (borda `#3A3324`) |
| Dourado (accent) | `#D4AF5A` · claro `#E8C877` · fundo dourado escuro `#26231B` |
| Texto | `#F4F1EA` · secundário `#A8A39A` |
| Alerta / erro | `#F0876A` |
| Fontes | Títulos: **Sora** (600/700) · Texto: **Inter** (400/500/600) |
| Tela base | 390 × 844 (celular) · barra de abas inferior com 82px |

Ícones: traço fino (estilo Lucide). Nada de emoji. Alvos de toque com no mínimo 44px.

## 3. Navegação (barra inferior)

Início · Jornada · Treinar · Agenda · Perfil

Telas secundárias: Missões (pelo Início), Avaliação do vídeo (pelo Treinar), Cadastro e Conexões (pelo Perfil).

## 4. Telas e funcionalidades

### 4.1 Início (`Main.dc.html`)
- Saudação com o nome e um botão de notificações.
- **Nível de orador** (1 a 5, ex.: "Comunicador Confiante" → "Orador de Impacto"), barra de progresso e dias seguidos treinando.
- **Desafio do dia** (60s): texto do desafio e o botão "Gravar agora", que leva ao Treinar. Atalho para "Missões da semana".
- **Próximo encontro presencial:** data, nome, sala do Espaço Atitude e o botão do ingresso/QR.
- **Continue de onde parou:** a última aula, com o progresso.

### 4.2 Jornada (`Jornada.dc.html`) — já interativa no protótipo
- Abas no topo: **Trilha | Histórico (n)**.
- **Frequência:** "X de 11 encontros" com uma barra.
- **11 encontros:** de 1 a 10 são módulos, e o **11 é a Formatura** (destaque dourado, com "Certificado + vídeo do antes e depois").
  - Títulos provisórios: Presença e postura; Voz, ritmo e respiração; Abertura de impacto; Storytelling que gera conexão; Linguagem corporal e olhar; Persuasão e pitch; Improviso e perguntas difíceis; Apresentações com slides; Comunicação em vídeo e redes; Palco: sua primeira palestra; Formatura.
- **Tocar num encontro abre a tela da aula:**
  - O bloco **"Parte teórica · aula gravada"** abre o vídeo no YouTube (vídeos "não listados"). Ideal futuro: tocar o vídeo embutido no app e registrar que o aluno assistiu.
  - **Abas:** *Sobre a aula* (Objetivo / O que vamos praticar / Tarefa para casa) · *Materiais* (anexos PDF para baixar) · *Links* (YouTube e links externos, abrindo direto no YouTube).
  - Botão **"Marcar presença neste encontro"** → abre a **janela de confirmação** ("Confirmar presença no Encontro X? Vai para o seu histórico com a data de hoje, conta para o certificado e não pode ser desfeita") → **Sim, confirmar** / Cancelar.
  - Depois de confirmar: um aviso "Presença confirmada e salva no seu histórico", e o botão vira "Presença confirmada · dd/mm às hh:mm".
- **Histórico:** lista dos encontros confirmados, com a data e a hora da confirmação.
- Regra sugerida: liberar a presença só no horário do encontro ou depois de ler o QR code da sala.
- Todo o conteúdo das aulas (textos, anexos, links) é cadastrado pela escola num painel administrativo.

### 4.3 Treinar (`Treinar.dc.html`)
- Botão grande para gravar, ou **enviar um vídeo** para avaliação.
- Resumo do último treino (nota, ritmo, vícios) e o link "Ver avaliação completa do vídeo".
- Atalhos: **Simulador de vendas por voz** (Arena Atitude) e **Teleprompter** com os roteiros do professor.

### 4.4 Avaliação do vídeo (`Avaliacao.dc.html`)
Resultado da análise por IA, com os **critérios da Atitude**:
- **Nota geral** de 0 a 100 e uma linha do tempo do vídeo com marcas de acertos (dourado) e erros (vermelho).
- **Alerta de fechamento proibido:** terminar com "é isso" (nunca pode).
- **3 pontos fortes** e **3 pontos a desenvolver**, cada um com o momento do vídeo e um exercício.
- **Vícios de linguagem (cirúrgico):** cada vício com a contagem e todos os momentos ("né", "é...", "tipo", "então", "é isso"...), frequência (1 a cada X segundos) e meta.
- **Vícios corporais:** mão no cabelo, mãos presas/entrelaçadas, balançar o corpo (contagem e momentos).
- **Postura e movimentação:** postura firme, balanço lateral (de um lado para o outro), pêndulo (para frente e para trás).
- **Gestos e mãos:** uso das mãos, **% do tempo na Zona P** (entre o peito e o umbigo), acima ou abaixo dela, ênfase não verbal.
- **Contato visual:** % de olhar para a plateia/câmera, olhar para cima ou para baixo (tira credibilidade), olhar fixo demais.
- **Microfone** (quando houver): pegada mais embaixo (contrapeso), não tampar a boca, distância constante.
- **Voz e ênfase:** volume, tom e variação, ênfase verbal, velocidade/ritmo (palavras por minuto), pausas.
- Botões: "Gravar de novo aplicando os ajustes" e "Pedir revisão do professor".

**Implementação sugerida:**
- Fala: transcrição com marcação de tempo por palavra (Whisper) → contagem de vícios, palavras por minuto, pausas, detecção do "é isso" no final.
- Áudio: volume e variação de tom (análise de energia e de frequência).
- Corpo: estimativa de pose (MediaPipe Pose) → posição dos punhos em relação ao peito e ao umbigo (Zona P), deslocamento lateral e frontal do quadril e dos ombros, mão perto da cabeça (cabelo). Rosto/olhar: MediaPipe Face Mesh (direção da cabeça e dos olhos).
- Texto do feedback: um modelo de linguagem (Claude) recebe as métricas, a transcrição e a **régua de notas da escola**, e escreve os pontos fortes e a desenvolver no tom da Atitude.
- A escola define a régua (o que vale 100 / 70 / 40 em cada critério) e os pesos.
- Pedir autorização de uso do vídeo (LGPD). Limite de avaliações por plano.

### 4.5 Agenda e comunidade (`Agenda.dc.html`)
- **Ingresso com QR** para o check-in no Espaço Atitude.
- Lista de eventos com etiqueta *Inscrito* ou *Club* (ex.: Atitude Empresarial 27–28/11, Mastermind 05/12, Formação de Palestrantes 11–12/12, Planejamento Estratégico 12/12).
- **Mural da turma** (posts dos alunos).

### 4.6 Perfil (`Perfil.dc.html`)
- Atalho "Cadastro X% · completar" e botão para Conexões.
- **Evolução em vídeo:** o vídeo do 1º dia ao lado do de hoje, com as notas, e opção de compartilhar.
- Medalhas/conquistas.
- **Indique e ganhe** (link pessoal, benefício definido pela escola).
- Convite **Próximo passo: Atitude Club**.

### 4.7 Cadastro (`Cadastro.dc.html`)
- **Visível para a comunidade:** foto, nome, empresa, cargo, o que a empresa faz, segmento, **número de colaboradores** (Só eu / 2–10 / 11–50 / 51–200 / 200+), cidade, Instagram/site, "Posso ajudar com", "Estou procurando", e a opção de aparecer em Conexões.
- **Só a escola vê** (privado): WhatsApp, aniversário, faixa de faturamento, maior desafio do negócio, objetivo com a Atitude, como conheceu a escola, e campos extras configuráveis pela escola.
- Medalha ao completar o cadastro.

### 4.8 Conexões (`Conexoes.dc.html`)
- Busca por nome, empresa ou segmento e filtros (Todos, Minha turma, segmentos).
- Cartão de cada aluno: nome, cargo, empresa, o que faz, colaboradores, "Procura: ...", botões **Conectar** e **Ver perfil**.

### 4.9 Missões (`Missoes.dc.html`)
- **Pontos Atitude**, a barra até a próxima recompensa e a posição na turma.
- **Missão da semana: Live em dupla** (+300): o app **sorteia a dupla**, sugere 3 temas, o aluno faz a live marcando @atitude e envia o print ou o link para validar. Os dois ganham a medalha "Sem Medo da Câmera".
- **Missões semanais:** 3 desafios do dia (+100), 1 minuto sem "né" (+150, validado pela IA), pergunta em voz alta no encontro (+50).
- **Missões de coragem:** live em trio (+500), postar um vídeo no Instagram (+200), falar no Palco Aberto do mês (+800).
- **Recompensas** trocadas por pontos (definidas pela escola; exemplos: brinde, feedback individual em vídeo, convite para um evento do Club, Destaque do mês no palco).
- **Ranking da turma.**
- Sugestão: um link de indicação próprio por dupla na live, com pontos extras por matrícula.

### 4.10 Painel da escola (`Painel.dc.html`) — web, só para a equipe
- Indicadores: alunos ativos na semana, treinos gravados, alunos em risco (14+ dias sem abrir o app), prontos para o próximo passo, indicações.
- **Alunos sumindo** → botão "Chamar no WhatsApp".
- **Prontos para comprar de novo** → oferecer Club / B2B / mentoria.
- Futuro: cadastro do conteúdo das aulas (textos, anexos, links do YouTube), validação de missões e lives, régua de avaliação, integração com o CRM da Atitude.

## 5. Dados principais (modelo sugerido)

- `alunos` (perfil público + dados privados, turma, nível, pontos)
- `turmas` · `encontros` (número 1–11, título, sobre, anexos[], links[], vídeo teórico)
- `presencas` (aluno, encontro, data/hora da confirmação)
- `videos` e `avaliacoes` (notas por critério, vícios com tempos, pontos fortes/desenvolver)
- `missoes` · `missoes_concluidas` (validação, pontos) · `recompensas` · `resgates`
- `eventos` · `ingressos` (QR, check-in)
- `conexoes` (solicitações entre alunos)

## 6. Ordem sugerida de construção (versão 1)

1. Login + cadastro do aluno.
2. Jornada com as 11 aulas, abas, presença com confirmação e histórico.
3. Envio de vídeo + avaliação por IA (começar pela fala: vícios, ritmo, pausas, "é isso").
4. Missões e pontos.
5. Agenda/QR, Conexões e o painel da escola.
