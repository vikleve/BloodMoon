# 🌕 Lunar Explorer

Aplicação web educativa e interativa sobre as oito fases da Lua.

## Estrutura de arquivos

```
Vik/
├── index.html   # Estrutura HTML5 semântica com os três módulos
├── style.css    # Identidade visual espacial, layout e animações
├── script.js    # Lógica de todos os módulos e interatividade
└── README.md    # Este arquivo
```

## Módulos

| Módulo | Requisitos | Descrição |
|---|---|---|
| Explorador Lunar | RF01–RF04 | Visualize e explore as 8 fases com representação CSS, descrição científica e navegação circular |
| Simulador do Ciclo | RF05–RF08 | Animação do ciclo de 29,53 dias com controles de iniciar/pausar/reiniciar e velocidade ajustável |
| Quiz Lunar | RF09–RF12 | 10 perguntas embaralhadas com feedback imediato, explicações e pontuação final |

## Como executar

1. Abra a pasta `Vik/` no explorador de arquivos.
2. Dê duplo clique em **`index.html`** para abrir no navegador padrão.
3. Ou, na linha de comando:

```powershell
# Windows — abrir no navegador padrão
Start-Process "C:\Users\GTI\Documents\Vik\index.html"
```

Não são necessários servidor web, Node.js ou qualquer dependência externa.

## Requisitos implementados

| RF | Descrição | Status |
|---|---|---|
| RF01 | Apresentar as 8 fases da Lua | ✅ |
| RF02 | Detalhes ao selecionar uma fase (nome, descrição, iluminação, posição) | ✅ |
| RF03 | Representação visual da Lua com iluminação astronômica correta | ✅ |
| RF04 | Navegação circular anterior/próximo | ✅ |
| RF05 | Simulação animada do ciclo de 29,53 dias | ✅ |
| RF06 | Controles Iniciar, Pausar, Reiniciar | ✅ |
| RF07 | Controle de velocidade (1×, 5×, 10×, 30×, 60×) | ✅ |
| RF08 | Barra de progresso e contador de dias sincronizados | ✅ |
| RF09 | ≥8 perguntas com 4 alternativas cada | ✅ (10 perguntas) |
| RF10 | Uma resposta por pergunta, bloqueio pós-confirmação, feedback imediato | ✅ |
| RF11 | Progresso, pontuação final e reinício do quiz | ✅ |
| RF12 | Banco de perguntas estruturado em JavaScript | ✅ |

## Tecnologias

- **HTML5** — semântica, ARIA, roles e navegação por teclado
- **CSS3** — variáveis custom, clip-path para fases lunares, animações, responsividade
- **JavaScript puro** — `requestAnimationFrame`, módulos funcionais, sem dependências

## Compatibilidade

Funciona em qualquer navegador moderno: Chrome, Firefox, Edge, Safari.

Testado em telas de 320 px (celular) a 1440 px (desktop).
