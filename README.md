# Lucas MD IA : Assistente de Anamnese Médica (Agno + Ollama)

Este projeto é um Assistente de Missão Crítica para emergências hospitalares que utiliza Inteligência Artificial Generativa para processar, higienizar e estruturar anamneses brutas através de uma arquitetura **RAG (Retrieval-Augmented Generation)**.

## 🚀 Sobre o Projeto

O sistema permite que médicos convertam anotações rápidas em documentos clínicos estruturados, garantindo conformidade com terminologias técnicas, sugestão automática de **CID-10** e extração de sintomas chave.

A arquitetura opera sob o paradigma **Zero-G (Zero-Latency / Zero-Hallucination)**, utilizando uma base de conhecimento local alimentada por estudos de caso validados (Case Studies).

### ✨ Diferenciais Técnicos
- **Privacidade Absoluta (LGPD/HIPAA)**: Processamento 100% local via Ollama.
- **RAG Avançado**: Uso de LanceDB para busca vetorial semântica de protocolos e CIDs.
- **Higienização Inteligente**: Filtro automático de termos inadequados para terminologia técnica.
- **Resiliência de Schema**: Validação Pydantic estrita com tratamento de falhas em tempo real (HTTP 422).

## 🛠️ Stack Tecnológica de Elite

### Backend
- **Core**: Python 3.12+ | Django 5.x (Assíncrono via `adrf`)
- **Orquestração de Agentes**: [Agno](https://agno.com/) (ex-Phidata)
- **Base Vetorial (RAG)**: LanceDB
- **Embeddings**: `nomic-embed-text` (768d)
- **Validação**: Pydantic v2

### Frontend
- **Library**: React 19 (Vercel Best Practices)
- **Styling**: Tailwind CSS (Royal Blue / Slate Theme)
- **Build Tool**: Vite

### IA Local (Infra)
- **Engine**: Ollama
- **LLM Principal**: `gemma4:e4b` (Google Gemma 2 optimized)
- **Protocolo**: Ollama REST API

## 📋 Pré-requisitos

- Python 3.12+
- Node.js 20+
- [Ollama](https://ollama.com/) instalado e rodando.

## ⚡ Como Executar (Protocolo Sênior)

### 1. Preparação dos Modelos (IA)
```bash
# Baixar o modelo de inferência e os embeddings
ollama pull gemma4:e4b
ollama pull nomic-embed-text
```

### 2. Ambiente Backend
```bash
# Na raiz do projeto
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver
```

### 3. Ambiente Frontend
```bash
# terminal separado, na pasta frontend
cd frontend
npm install
npm run dev
```

## 📝 Governança e Release

Este projeto segue o padrão **Conventional Commits** e utiliza **Changelog Fragments** para rastreabilidade de iterações de IA. Veja a pasta `/changelog` para o histórico completo.

## 🛡️ Segurança Clínica

O sistema implementa:
- Sanitização de texto via `Regex` e `Blocklist`.
- Proteção contra IDOR e injeção de prompt no nível da View.
- Auditoria de logs de inferência para rastreamento de alucinações.

---
**Lucas MD IA** - Desenvolvido sob padrões de arquitetura de alta performance.
