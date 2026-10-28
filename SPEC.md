# ESPECIFICAÇÃO DE SOFTWARE (SPEC)
## BloodMoon — Lunar Explorer

*Versão:* 1.0  
*Tipo de projeto:* Aplicação web educativa  
*Tecnologias:* HTML5, CSS3 e JavaScript  
*Repositório:* https://github.com/vikleve/BloodMoon

## 1. Objetivo do projeto

O BloodMoon — Lunar Explorer é uma aplicação web educativa que permite aos usuários conhecer as fases da Lua, acompanhar uma simulação do ciclo lunar e testar seus conhecimentos por meio de um questionário interativo.

O objetivo desta especificação é orientar a revisão e a melhoria do sistema existente, preservando sua estrutura e identidade visual, corrigindo problemas de precisão, acessibilidade, responsividade e testes.

## 2. Escopo do sistema

O sistema deverá possuir três módulos principais:

### 2.1. Explorador lunar

Permitir que o usuário consulte as oito fases principais da Lua:

1. Lua Nova;
2. Lua Crescente;
3. Quarto Crescente;
4. Lua Gibosa Crescente;
5. Lua Cheia;
6. Lua Gibosa Minguante;
7. Quarto Minguante;
8. Lua Minguante.

O módulo deverá apresentar a representação visual da fase selecionada, seu nome, uma descrição educativa e informações sobre a iluminação lunar.

O usuário deverá conseguir navegar entre as fases utilizando os controles de anterior e próximo, incluindo a navegação circular entre a primeira e a última fase.

### 2.2. Simulador lunar

Permitir que o usuário acompanhe uma simulação do ciclo lunar.

O simulador deverá oferecer:

- Botão para iniciar a simulação;
- Botão para pausar a simulação;
- Botão para reiniciar o ciclo;
- Controle de velocidade;
- Indicador do dia do ciclo;
- Barra de progresso;
- Representação visual da fase lunar correspondente ao dia simulado.

O ciclo sinódico deverá ser representado com duração aproximada de 29,53 dias. A interface deverá deixar claro que se trata de uma simulação educativa, e não de uma reprodução astronômica de alta precisão.

### 2.3. Quiz lunar

Disponibilizar um questionário com dez perguntas sobre a Lua e suas fases.

Cada pergunta deverá possuir quatro alternativas, com apenas uma resposta correta.

O módulo deverá:

- Apresentar uma pergunta por vez;
- Permitir a seleção de uma alternativa;
- Informar se a resposta está correta ou incorreta;
- Exibir feedback educativo;
- Contabilizar a pontuação;
- Apresentar o resultado final;
- Permitir reiniciar o questionário.

A pontuação deverá ser calculada corretamente, sem contabilizar a mesma pergunta mais de uma vez.
