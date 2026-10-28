# 🌕 BloodMoon — Lunar Explorer

Aplicação web educativa e interativa sobre as fases da Lua, simulação do ciclo sinódico e quiz de fixação do conhecimento.

*Versão:* 1.0  
*Tecnologias:* HTML5, CSS3 e JavaScript puro (Vanilla JS)  
*Repositório:* [https://github.com/vikleve/BloodMoon](https://github.com/vikleve/BloodMoon)

---

## 📁 Estrutura de Arquivos

```
BloodMoon/
├── index.html       # Estrutura HTML5 semântica com os três módulos e A11y
├── style.css        # Identidade visual espacial, CSS responsivo e clip-paths lunares
├── script.js        # Lógica dos módulos, simulação do ciclo e quiz lunar
├── test.js          # Suíte de testes automatizados multiplataforma (Node.js)
├── test.sh          # Script de execução rápida para Linux / macOS
├── test_static.ps1  # Script de testes estáticos para PowerShell (Windows)
├── CONTRIBUTING.md  # Diretrizes de contribuição, branches e commits
├── SPEC.md          # Especificação de software completa (SPEC 1.0)
└── README.md        # Documentação do projeto
```

---

## 🚀 Módulos do Sistema

### 1. Explorador Lunar
Permite ao usuário consultar as **oito fases principais da Lua** com representação visual em tempo real, iluminação aproximada, posição no ciclo e descrições educativas aprofundadas:

1. **Lua Nova**
2. **Lua Crescente**
3. **Quarto Crescente**
4. **Lua Gibosa Crescente**
5. **Lua Cheia**
6. **Lua Gibosa Minguante**
7. **Quarto Minguante**
8. **Lua Minguante**

Inclui **navegação circular** contínua entre a primeira e a última fase tanto pelos botões quanto pela grade interativa.

### 2. Simulador do Ciclo Lunar
Simula a transição contínua ao longo dos **29,53 dias do ciclo sinódico**:
- Botões de **Iniciar**, **Pausar** e **Reiniciar**;
- Seletor de velocidade dinâmica (**1×, 5×, 10×, 30×, 60×**);
- Indicador do dia atual com precisão decimal;
- Barra de progresso animada e sincronizada;
- **Nota didática explícita:** informa com transparência que se trata de uma simulação educativa para fins didáticos, e não de uma reprodução astronômica de alta precisão.

### 3. Quiz Lunar
Questionário com **dez perguntas** sobre astronomia lunar:
- Apresenta uma pergunta por vez com 4 alternativas e apenas 1 correta;
- Feedback educativo imediato explicando o porquê de cada resposta;
- Trava de resposta única (impede dupla pontuação na mesma pergunta);
- Contabilização da pontuação e relatório de aproveitamento com percentual ao final;
- Botão para reiniciar o quiz com reembaralhamento das perguntas.

---

## 🛠️ Como Executar

Não são necessários servidores web pesados ou compilação de pacotes.

### Opção 1: Diretamente no Navegador
- Dê um duplo clique no arquivo **`index.html`** ou abra-o em qualquer navegador moderno (Chrome, Firefox, Edge, Safari, Opera).

### Opção 2: Servidor Local Simples (opcional)
```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

---

## 🧪 Testes Automatizados

O projeto inclui suíte completa de testes cobrindo integridade estrutural, acessibilidade ARIA, precisão astronômica das 8 fases, cálculos do ciclo e integridade das 10 questões do quiz:

### No Linux / macOS:
```bash
# Via script bash
./test.sh

# Ou diretamente com Node.js
node test.js
```

### No Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File .\test_static.ps1
```

---

## ♿ Acessibilidade e Responsividade

- **WCAG / ARIA:** Suporte a leitores de tela com `aria-live`, `role="tablist"`, `role="tabpanel"`, `role="progressbar"`, contrastes aprimorados e foco visível (`:focus-visible`).
- **Teclado:** Navegação por abas com setas direcionais (`ArrowLeft`, `ArrowRight`), fechamento do menu mobile com `Escape`, e seleção via `Enter` / `Espaço`.
- **Skip-link:** Atalho para pular direto ao conteúdo principal.
- **Responsivo:** Adaptado para celulares compactos (320px–480px), tablets (768px) e monitores amplos (1200px+).
- **Reduced Motion:** Respeita as preferências de acessibilidade vestibular com `@media (prefers-reduced-motion: reduce)`.
