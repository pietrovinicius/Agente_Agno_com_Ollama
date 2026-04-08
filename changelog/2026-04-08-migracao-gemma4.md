# Fragmento de Changelog: Migração para Gemma 4:e4b

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer)

## Mudanças
- **Motor de Inferência:** Substituição do `llama3.2` pelo `gemma4:e4b`.
- **Preload:** Atualização do script `preload_model.py` para garantir que o novo modelo de 4B seja carregado na memória.
- **Frontend:** Incremento da versão da interface para `V2.1.0` no painel clínico.

## Motivação e Ganhos (Padrão M4)
A migração para o Gemma 4 visa explorar as melhorias de raciocínio lógico e adesão a protocolos médicos (M4) do novo modelo do Google. Espera-se uma melhor estruturação dos campos CID-10 e uma redação técnica mais precisa para o texto melhorado de anamnese.

## Impacto
- Substituição total do backend de IA.
- Necessidade de `ollama pull gemma4:e4b` no ambiente local.
