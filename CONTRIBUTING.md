# Fluxo de contribuição

Este repositório utiliza branches de tarefa, commits padronizados e pull requests para manter as alterações organizadas.

## 1. Atualize a branch principal e crie uma branch de trabalho

A branch principal deste repositório é `master`.

```bash
git checkout master
git pull origin master
git checkout -b feature/nome-da-tarefa
```

Use nomes curtos, em minúsculas e separados por hífens. Exemplos: `feature/tela-de-login`, `fix/erro-no-quiz` e `docs/atualiza-readme`.

## 2. Faça commits claros

Cada commit deve descrever uma mudança específica. Comece a mensagem com um dos tipos abaixo:

- `feat:` — nova funcionalidade.
- `fix:` — correção de defeito.
- `docs:` — documentação.
- `style:` — alterações de formatação sem mudar a lógica.
- `refactor:` — reorganização do código sem alterar o comportamento.
- `test:` — testes.
- `chore:` — manutenção e ferramentas.

Exemplos:

```bash
git add .
git commit -m "feat: adiciona navegação entre fases lunares"
git commit -m "fix: corrige progresso do simulador"
git commit -m "docs: atualiza instruções de execução"
```

## 3. Envie a branch e abra um pull request

```bash
git push -u origin feature/nome-da-tarefa
```

Abra um pull request direcionado a `master`. Descreva o objetivo, as principais mudanças e como validar o resultado. Não envie alterações diretamente para a branch principal.

## 4. Checklist antes de concluir

- [ ] A branch foi criada a partir da versão atualizada de `master`.
- [ ] Os commits têm mensagens claras e prefixos padronizados.
- [ ] A aplicação foi verificada no navegador.
- [ ] A navegação por teclado e a apresentação em telas pequenas continuam funcionando quando aplicável.
- [ ] O pull request descreve as mudanças e os passos de teste.
- [ ] Não foram incluídos arquivos temporários, credenciais ou dados pessoais.

## 5. Verificação local

Como o projeto usa HTML, CSS e JavaScript sem dependências externas, abra `index.html` no navegador e teste os módulos afetados. Verifique as ferramentas do desenvolvedor para identificar erros no console.
