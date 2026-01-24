# Assistente de Anamnese Médica com IA (Agno + Ollama)

Este projeto é um MVP (Minimum Viable Product) de uma aplicação de auxílio médico que utiliza Inteligência Artificial Generativa para processar e estruturar anamneses brutas.

## 🚀 Sobre o Projeto

A aplicação permite que médicos digitem anotações rápidas e desestruturadas (anamnese bruta) e recebam instantaneamente uma versão técnica, polida e estruturada, incluindo sugestões de códigos CID-10 e lista de principais sintomas.

O sistema utiliza o framework **Agno** para orquestração de agentes de IA e roda totalmente local com **Ollama** e o modelo **Llama 3.1**, garantindo privacidade e velocidade.

### ✨ Funcionalidades
- **Processamento de Linguagem Natural**: Transforma texto informal em terminologia médica técnica.
- **Sugestão de CID-10**: Identifica e sugere o código CID mais apropriado para o caso relatado.
- **Extração de Sintomas**: Lista os principais sintomas identificados no relato.
- **Interface Intuitiva**: Visualização "Antes e Depois" para fácil comparação e validação.
- **Arquitetura Assíncrona**: Backend otimizado para não bloquear durante a inferência da IA.

## 🛠️ Stack Tecnológica

### Backend
- **Linguagem**: Python 3.12+
- **Framework Web**: Django 5.x
- **API**: Django Rest Framework (DRF) + `adrf` (Async Support)
- **Orquestração de IA**: Agno
- **Validação de Dados**: Pydantic
- **Testes**: Pytest + Pytest-Django

### Frontend
- **Library**: React
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Cliente HTTP**: Axios

### IA & Infraestrutura
- **LLM Engine**: Ollama (Local)
- **Modelo**: Llama 3.1

## 📋 Pré-requisitos

- Python 3.12 ou superior
- Node.js e npm
- [Ollama](https://ollama.com/) instalado

## ⚡ Como Executar

Para instruções detalhadas com todos os comandos, consulte o arquivo [Anotacoes.txt](./Anotacoes.txt).

### Resumo Rápido:

1.  **Prepare a IA**:
    ```bash
    ollama serve
    ollama pull llama3.1
    ```

2.  **Inicie o Backend**:
    ```bash
    # Na raiz do projeto
    python3.12 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd backend
    python manage.py migrate
    python manage.py runserver
    ```

3.  **Inicie o Frontend**:
    ```bash
    # Em outro terminal, na pasta frontend
    cd frontend
    npm install
    npm run dev
    ```

4.  **Acesse**:
    Abra `http://localhost:5173` no seu navegador.

## 🧪 Testes

O projeto possui testes unitários para garantir a integridade da API.
```bash
# No diretório backend, com venv ativado:
pytest
```

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.
