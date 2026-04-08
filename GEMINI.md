# 🤖 Diretrizes de Inteligência Artificial (GEMINI.md)

## 📌 Contexto do Projeto

Este projeto é um **Assistente de Anamnese Médica** de missão crítica desenvolvido para uso em emergências hospitalares.
**Stack Técnica:** Python 3.12+, Django 5.x (Assíncrono), React + TailwindCSS, Agno (ex-Phidata), Ollama (Llama 3.2 local), e LanceDB (RAG Vetorial).
**Prioridades Absolutas:** Segurança clínica, privacidade de dados (LGPD), performance (baixa latência) e alta disponibilidade.

---

## 🛑 REGRA 0: Meta-Skills (using-superpowers)

**OBRIGATÓRIO:** Antes de iniciar qualquer tarefa, analisar o código, ou responder a uma dúvida de implementação, a IA **deve** avaliar qual das skills abaixo se aplica. Se houver 1% de chance de uma skill ser útil, ela deve ser ativada implicitamente para guiar a execução. O planejamento e a aplicação das melhores práticas vêm sempre antes da escrita do código.

---

## 📐 Fase 1: Planejamento e Arquitetura

### 1. Brainstorming e Design

- **Não codifique imediatamente.** Se a feature for nova, complexa ou alterar o banco de dados (Oracle/SQLite), proponha primeiro a arquitetura.
- Documente os Requisitos Não Funcionais (latência, concorrência, auditoria).
- Aguarde a confirmação de "Understanding Lock" antes de gerar o código final.

### 2. Senior Fullstack

- Utilize os scripts de automação (`fullstack_scaffolder.py`, `project_scaffolder.py`, `code_quality_analyzer.py`) para validar a arquitetura e manter o padrão de qualidade do repositório.
- Siga os padrões de projeto documentados para manter a escalabilidade entre o Django e o React.

---

## ⚙️ Fase 2: Backend & IA (Python & Django Pro)

### 3. Python Pro (3.12+)

- Utilize tipagem estática rigorosa (`typing`, `Pydantic`).
- Priorize operações assíncronas (`async/await`) para I/O-bound, especialmente na comunicação com o LanceDB e Ollama.
- Use `uv` para gestão de pacotes e `ruff` para linting/formatação.

### 4. Django Pro (5.x)

- Utilize as features assíncronas do Django 5.x (`adrf`). A thread principal nunca deve ser bloqueada por inferências da IA.
- Otimize o ORM de forma agressiva (`select_related`, `prefetch_related`) para consultas ao banco de dados clínico.
- Isole a lógica de negócios e as integrações de IA (`agents.py`) da camada de roteamento (`views.py`).

---

## 🖥️ Fase 3: Frontend & Design (React & UI/UX)

### 5. Vercel React Best Practices

- **Tamanho do Bundle:** Evite "barrel files" e use `lazy loading` para componentes pesados não essenciais.
- **Waterfalls:** Busque dados em paralelo sempre que possível.
- **Re-renders:** Utilize estado derivado e otimize dependências de `useEffect` para evitar engasgos na interface durante o processamento da IA.

### 6. UI/UX Pro Max (Premium Medical Authority)

- **Acessibilidade Absoluta:** Contraste mínimo de 4.5:1. O ambiente da emergência é estressante; a interface deve ser de alto contraste e legível.
- **Feedback Tátil e Cognitivo:** Estados de "Loading" devem ser claros (cronômetros, animações suaves). Use cursores adequados e não utilize emojis como ícones (use SVG/Lucide).
- **Design System:** Mantenha a paleta **Royal Blue / Slate** e tipografia **Inter**.

---

## 🛠️ Fase 4: Qualidade e Testes

### 7. Test-Driven Development (TDD)

- **A Lei de Ferro:** Nenhuma linha de código de produção será escrita sem um teste falhando primeiro (Red-Green-Refactor).
- Os testes devem ser executados e a falha deve ser validada antes de criar a solução mínima necessária para aprovação.

### 8. Clean Code & Code Review Excellence

- Ao analisar PRs, priorize a segurança clínica (injeção de dados) e otimização ORM.
- Substitua comentários explicativos por código auto-documentado (funções de responsabilidade única e nomes explícitos).
- Trate exceções explicitamente; não silencie erros.

### 9. Debugger Root-Cause

- Se ocorrer um erro, isole o problema. Verifique logs, rastreie o stack trace e identifique se a falha é na aplicação, na rede, no LanceDB ou no Agno.
- Proponha e teste uma hipótese de causa raiz antes de aplicar o "quick fix".

---

## 📦 Fase 5: Versionamento e Release

### 10. Atualização e Changelog

- **Versão nos Rodapés:** Antes de qualquer commit, atualize a versão de todos os rodapés do sistema (interface/frontend).
- **Changelog Fragmentado:** Crie sempre o arquivo descritivo das mudanças na pasta `/changelog` na raiz do projeto.

### 11. Git Pushing & Commits

- Todo código entregue deve ser registrado seguindo o padrão **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `perf:`).
- **Idioma e Execução:** As mensagens de commit devem ser escritas obrigatoriamente em **português**. Em seguida, execute imediatamente o `push` das alterações.
