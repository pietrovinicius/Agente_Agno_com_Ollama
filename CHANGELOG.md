# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.1.0] - 2026-01-23

### Adicionado

#### Backend
- **Estrutura do Projeto**: Configuração inicial do Django 5.x com `config` e app `anamnese`.
- **API REST**: Implementação com Django Rest Framework (DRF).
- **IA/Agentes**:
    - Criação de `agents.py` com integração ao framework Agno.
    - Configuração do agente "Assistente Clínico Sênior" usando modelo `llama3.1` via Ollama local.
    - Definição de Schema Pydantic `AnamneseSchema` para estruturação de dados (Texto Melhorado, CID Sugerido, Sintomas).
- **Endpoints**:
    - `POST /api/processar-anamnese/`: Endpoint assíncrono para receber texto bruto e retornar análise estruturada.
- **Assincronismo**: Implementação de suporte `async` com `adrf` (Async Django Rest Framework) para evitar bloqueio da thread principal durante inferência da IA.
- **Testes**: Configuração de `pytest` e `pytest-django` com testes unitários para a API (`tests/test_api.py`), incluindo mocking do agente de IA.
- **Configuração**: Setup de CORS (`django-cors-headers`) para comunicação com o frontend.

#### Frontend
- **Framework**: Criação do projeto com React e Vite.
- **Estilização**: Configuração completa do Tailwind CSS.
- **Interface (UI)**:
    - Tela principal com divisão "Antes" (Input) e "Depois" (Resultado).
    - Componente de `Textarea` para entrada de anamnese.
    - Exibição estruturada dos resultados: Texto revisado, Card de CID-10 e Lista de Sintomas.
    - Feedback visual de "Carregando" durante o processamento.
- **Integração**: Conexão com a API Django via `axios`.

#### DevOps & Documentação
- **Dependências**: Arquivo `requirements.txt` completo.
- **Git**: Configuração de `.gitignore` para Python e Node.js.
- **Documentação**: Criação de `README.md`, `CHANGELOG.md` e `Anotacoes.txt` com instruções de setup.

### Infraestrutura Local & Correções
- **Ollama Local**: Instalação manual do binário do Ollama na pasta `tools/` do projeto.
- **Configuração de Ambiente**: Criação de diretório `ollama_home` para armazenar modelos e dados localmente, contornando restrições de permissão do sistema.
- **Scripts**: Adicionado `start_ollama.sh` para inicialização automática do servidor Ollama com as variáveis de ambiente corretas.
- **Qualidade de Código**: Correções de formatação PEP-8 (imports, espaçamento, linhas em branco) em `agents.py`, `views.py` e `settings.py`.
- **Frontend Build**: Correção de compatibilidade entre Tailwind CSS v4 e PostCSS substituindo o plugin `tailwindcss` por `@tailwindcss/postcss` no arquivo `postcss.config.js`.
- **Agentes**: Correção de `TypeError` na inicialização do `Agent` em `agents.py`, substituindo o parâmetro `response_model` por `output_schema` conforme a API atual do Agno.

### Melhorias de Design e UX (0.1.1)
- **Novo Layout de Dashboard**: Reestruturação completa da interface para um layout de Dashboard Médico com Sidebar lateral e divisão em duas colunas (Registro Clínico vs Insights IA).
- **Design System Atualizado**: Adoção de paleta profissional `Sky/Slate` (Azul Céu e Cinza) sobre fundo `Gray-50` para maior conforto visual e modernidade.
- **Componentes Avançados**:
    - **Input Interativo**: Campo de texto com label flutuante e estados de foco aprimorados.
    - **Cards de Insights**: Visualização de resultados com bordas laterais coloridas (`border-l-4`) para distinção rápida entre Diagnóstico e Conduta.
    - **Micro-interações**: Feedback visual com ícones `Lucide-React`, animações de pulsação durante processamento e indicadores de status.
- **Produtividade**: Ações rápidas de "Aprovar Sugestão" e "Editar Manualmente" com feedback via Toast Notifications.

### Refinamento Visual "Medical Blue" (0.1.2)
- **Paleta de Cores Premium**: Substituição do "Sky Blue" pelo "Royal Blue" (Azul Médico Profundo) para transmitir maior autoridade e confiança.
- **Interface de Editor Rico**: O campo de anamnese agora simula um editor de texto profissional com barra de ferramentas (Negrito, Itálico, Listas).
- **Botões "New Skeuomorphism"**: Adição de gradientes sutis, sombras coloridas e feedback tátil (clique/hover) nos botões de ação.
- **Tipografia e Espaçamento**: Ajustes finos em pesos de fonte (font-semibold) e espaçamento (whitespace) para melhor legibilidade.
- **Sidebar Destacada**: Adição de sombreamento profundo na barra lateral para melhor separação visual das camadas.

### UX Aprimorada (0.1.3)
- **Formatação de Tempo Inteligente**: O cronômetro de processamento agora exibe o tempo em minutos e segundos (ex: "4m 23s") para durações mais longas, melhorando a legibilidade.

### Persistência e Integração (0.1.4)
- **Backend - Persistência**: Criação do modelo `Anamnese` para salvar históricos no banco de dados SQLite.
- **Backend - API**: Novo endpoint `POST /api/salvar-anamnese/` e rota raiz `/` informativa com status da API.
- **Backend - Admin**: Configuração do Django Admin para visualização, filtro e busca de anamneses processadas.
- **Frontend - Integração**: Conexão do botão "Aprovar Sugestão" com a API de persistência, garantindo que os dados aprovados sejam gravados no banco.

### Performance e Otimização (0.1.5)
- **Upgrade de Modelo**: Substituição do modelo `llama3.1` (8B) pelo `llama3.2` (3B) no Agente Clínico.
- **Ganho de Desempenho**: Redução drástica no consumo de memória RAM e tempo de inferência (avg: ~1m 12s), permitindo execução fluida em dispositivos como MacBook Air (8GB).
- **UX/UI**: Melhoria no feedback visual ao salvar anamnese, com alertas de confirmação e limpeza automática do formulário.

### Correções e Ajustes (0.1.6)
- **Correção de Bug**: Aumento do limite de caracteres do campo `cid_sugerido` no banco de dados (20 -> 100) para evitar erros ao salvar respostas mais verbosas da IA.
- **Refinamento de Prompt**: Ajuste nas instruções do Agente para solicitar códigos CID-10 mais concisos.
- **Otimização de Inferência**: Ajuste fino dos parâmetros do Ollama (`temperature=0`, `num_ctx=2048`, `top_k=20`) para reduzir o tempo de resposta (target: sub-15s).

### Integração de IA e Base de Conhecimento (0.1.7)
- **Context Injection**: Integração completa do arquivo `FAQ.MD` (Protocolos Clínicos) diretamente nas instruções do sistema do Agente Agno.
    - Implementação de leitura eficiente (Singleton) do arquivo de conhecimento.
    - Injeção dinâmica de contexto para garantir conformidade com protocolos institucionais sem latência de RAG vetorial.
- **Otimização de Contexto**: Ajuste da janela de contexto (`num_ctx`) do Ollama para 2048 tokens.
    - *Correção*: O aumento anterior para 4096 causou degradação severa de performance (50s+ de carregamento) no hardware local.
    - O valor de 2048 provou-se suficiente para FAQ + Anamnese com tempo de resposta sub-10s.
- **Limpeza de Dependências**: Remoção da biblioteca `lancedb` do `requirements.txt`, otimizando o build e reduzindo a complexidade do projeto.
- **Knowledge Base**: Criação e estruturação do arquivo `FAQ.MD` contendo:
    - Protocolos Clínicos Críticos (Sepse, Dor Torácica, AVC).
    - Diretrizes de Uso da IA e Persistência de Dados.
    - Segurança e Privacidade (LGPD).
    - Rotinas de Emergência.

### Monitoramento de Performance (0.1.8)
- **Backend**: Adição do campo `tempo_processamento` ao modelo `Anamnese` para registrar a duração da inferência da IA.
    - Atualização do `AnamneseSerializer` para validar e expor o novo campo.
    - Migração de banco de dados criada (`0003_anamnese_tempo_processamento.py`).
- **Frontend**: Integração do cronômetro de processamento com o fluxo de salvamento.
    - O tempo exibido na interface agora é enviado ao backend ao aprovar a sugestão.
- **Admin**: Adição da coluna "Tempo Processamento" na listagem de anamneses (`/admin`), com formatação amigável (ex: "12.50s") e ordenação.

### Otimização de Latência e Estabilidade (0.1.9)
- **Diagnóstico**: Identificação e correção de "Cold Start" severo do Ollama (latência de 60s+ na primeira chamada).
    - Comprovado via `debug_latency.py` que a injeção de contexto (`FAQ.MD`) tem impacto desprezível na performance.
- **Preload**: Implementação de script `preload_model.py` e atualização do `start_ollama.sh` para carregar o modelo na memória durante o boot do servidor.
- **Configuração do Agente**:
    - Definição explícita de `keep_alive=-1` para impedir que o modelo seja descarregado da memória após inatividade.
    - Redução de `num_ctx` para 1024 tokens e `num_predict` para 512, otimizando o throughput sem perda de qualidade para a tarefa.
    - Reversão estratégica para o modelo `llama3.2` (3B) após testes mostrarem que a versão 1B apresentava alucinações críticas (falha na geração de JSON/CID).
- **Resultado**: Redução do tempo de resposta "Warm" para ~10-15s (anteriormente >1m em alguns casos).
- **Testes**: Adição de testes unitários (`backend/tests/test_performance_tracking_new.py`) para validar a persistência da métrica de performance.


### Arquitetura RAG e Correções Críticas (0.2.0)
- **RAG Engineer Skill**: Implementação completa de **Retrieval-Augmented Generation (RAG)** substituindo a injeção simples de contexto.
    - Integração com **LanceDB** (Banco Vetorial Local) para indexação eficiente de conhecimento.
    - Script `ingest_knowledge.py` criado para vetorizar e ingerir o `FAQ.MD` e a nova base `cid10_sample.csv`.
    - Agente Clínico atualizado para realizar buscas semânticas (Vector Search) antes de gerar respostas, melhorando a precisão do CID-10 e Protocolos.
- **Correção de Timezone**: Ajuste do parâmetro `TIME_ZONE` em `settings.py` de `'UTC'` para `'America/Sao_Paulo'`, corrigindo o atraso de 3 horas nos registros do banco de dados.
- **Correções de Bugs**:
    - Resolução de `TypeError: Knowledge.__init__()` no backend, ajustando a instanciação da base de conhecimento na versão mais recente do framework Agno.
    - Ajuste no caminho do LanceDB para `~/.medical_lancedb` para evitar erros de sistema de arquivos em drives externos (SSD).
- **Infraestrutura**: Atualização de `requirements.txt` com `lancedb`, `pandas` e `tantivy` para suporte ao novo pipeline de dados.

### Redesign Frontend "Medical Premium" (0.3.0)
- **Nova Identidade Visual**: Implementação de estética "Premium Medical Authority" com tons Royal Blue e Slate, inspirada em softwares médicos de alta performance.
- **Tipografia**: Adoção da fonte **Inter** via Google Fonts para máxima legibilidade e modernidade.
- **Componentes Refinados**:
    - **Sidebar Glassmorphism**: Navegação lateral com efeito translúcido dark, ícones interativos e melhor hierarquia visual.
    - **Card "Papel Flutuante"**: Área de anamnese redesenhada como um documento físico flutuante, com barra de ferramentas tátil e sombras suaves.
    - **Feedback Orgânico**: Substituição de spinners simples por estados de carregamento contextuais e animações suaves (`animate-fade-in`).
- **UX Improvements**:
    - **Loading State**: Feedback visual mais rico durante o processamento da IA, com cronômetro integrado e mensagens de status.
    - **Input Limpo**: Remoção de conflitos de placeholder para uma experiência de digitação sem distrações.
