# HyperFlow AI

Crie uma aplicação mobile-first completa em React/TypeScript com Tailwind CSS chamada "HyperFlow Pro".

A aplicação deve ser 100% autônoma (armazenamento exclusivo via LocalStorage/State, sem depender de conexões externas de cloud ou backend proprietário).

DESIGN SYSTEM & VISUAL:

- Estilo: Dark mode atlético premium de alta densidade (Fundo #070b12, cards em degradê sutil #0f172a / #111827, bordas finas #1e293b, destaques em vermelho/laranja atlético #ef4444, texto #f8fafc e métricas #38bdf8).

- UI densa e tátil inspirada nos melhores apps do mundo (Hevy / Fitbod), sem espaços vazios.

==================================================

TELA PRINCIPAL: DASHBOARD DO ALUNO ('/')

==================================================

1. COACH BRIEFING DIÁRIO (HERO SECTION):

   - Frase Motivacional Diária do Treinador IA: Um bloco destacado no topo com uma citação estoica/atlética forte que muda a cada dia (ex: "A consistência silenciosa supera o entusiasmo barulhento. Hoje é dia de carga máxima.").

   - Status da Periodização: Badge moderno com barra de progresso visual: "Mesociclo de Hipertrofia • Semana 1 de 12 (Trava de Adaptação Neural Ativa)". O botão "Gerar Nova Rotina" fica bloqueado com tooltip explicativo sobre o ciclo de 12 semanas.

   - Grid de Métricas da Sessão (3 mini cards):

     * [Duração Est.: 45-50 min]

     * [Séries Totais: 16]

     * [Carga Acumulada: 0 kg]

2. SELETOR DE DIAS (TABS TÁTEIS):

   - Abas horizontais deslizantes (Seg, Ter, Qua, Qui, Sex, Sáb).

   - Indicador luminoso ativo sob o dia selecionado com o grupo muscular do dia (ex: "Peito, Ombro Lateral & Tríceps").

3. CARDS DE EXERCÍCIO COM TRACKER DE SÉRIES REAL:

   - Proporção visual limpa: miniatura do exercício em 16:9 com badge do músculo-alvo (#ef4444) e ícone sutil de play para zoom.

   - Nome do exercício com tipografia forte e botão de troca rápida no topo direito: "Variação" (substitui na hora caso o aparelho esteja ocupado).

   - Tabela de Séries Compacta (Estilo Log de Treino):

     * Linhas numeradas: Série 1, 2, 3, 4.

     * Coluna "Anterior" (exibindo histórico ou sugestão da IA: "24 kg × 10").

     * Coluna "Carga Atual" com input numérico limpo para o usuário digitar.

     * Checkbox circular de conclusão com animação verde (#10b981) ao concluir a série.

   - Dica Biomecânica da IA recolhível (ex: "Controle a fase excêntrica em 2 segundos e mantenha o cotovelo a 45 graus").

4. MODAL DE EXECUÇÃO EM TELA CHEIA:

   - Ao tocar na miniatura do exercício, abre modal escuro com player de vídeo/animação ampliado, instruções passo a passo numeradas e lista de "Erros mais comuns a evitar".

5. BARRA FIXA DE DESCANSO (STICKY BOTTOM):

   - Barra inferior fixa com visual de cronômetro profissional (#38bdf8).

   - Contagem regressiva ativa com botões rápidos (+60s, +120s para compostos pesados, Zerar) e alerta ao terminar.

==================================================

PAINEL ADMINISTRATIVO SECRETO ('/admin')

Acesso por senha simples ("admin123")

==================================================

1. Configuração do Motor de IA:

   - Campo para salvar OpenAI API Key no localStorage.

   - Seletor de Modelo (default: gpt-4o-mini).

   - Editor de System Prompt do Treinador para você calibrar as instruções científicas da IA.

2. Catálogo de Exercícios (CRUD Totalmente Local):

   - Gerenciamento dos exercícios que a IA pode usar: Nome, Grupo Muscular, Músculo Específico, URL do Vídeo MP4 e Exercício Equivalente para substituição.

   - O app NÃO deve usar links aleatórios de fotos (como Unsplash). Use dados mockados limpos com URLs consistentes.

3. Simulador de Geração:

   - Formulário de anamnese para testar novas fichas geradas pela IA e salvar no estado local.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f4017d33-4853-4b2f-9be6-bd018fd06364).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
