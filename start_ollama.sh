#!/bin/bash
# Script para iniciar o Ollama localmente com os dados no diretório do projeto

# Define o diretório base do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Configura o HOME para usar o diretório local ollama_home
export HOME="$PROJECT_DIR/ollama_home"

# Define o caminho do executável do Ollama
OLLAMA_BIN="$PROJECT_DIR/tools/Ollama.app/Contents/Resources/ollama"

echo "Iniciando Ollama..."
echo "HOME definido como: $HOME"
echo "Executável: $OLLAMA_BIN"

# Verifica se o executável existe
if [ ! -f "$OLLAMA_BIN" ]; then
    echo "Erro: Executável do Ollama não encontrado em $OLLAMA_BIN"
    echo "Certifique-se de que a pasta 'tools' está na raiz do projeto."
    exit 1
fi

# Inicia o servidor
"$OLLAMA_BIN" serve
