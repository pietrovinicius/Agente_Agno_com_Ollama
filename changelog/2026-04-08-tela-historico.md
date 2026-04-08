# Fragmento de Changelog: Tela de Histórico de Anamneses

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer)
**Versão:** v0.5.0

## Funcionalidades
- **Novo Componente `AnamneseHistory.jsx`**: Implementada interface premium para visualização de registros passados, com cards detalhados, badges de CID-10 e indicadores de performance.
- **Navegação Lateral**: Adicionada integração na Sidebar com controle de estado para alternar entre "Nova Admissão" e "Histórico".
- **Endpoint de Listagem**: Criado endpoint GET `/api/historico/` no Django, com suporte a processamento assíncrono e ordenação cronológica reversa.

## UI/UX
- **Design System**: Mantida a paleta **Royal Blue / Slate** com foco em legibilidade clínica.
- **Feedback Visual**: Adicionados Skeletons de carregamento e Empty States informativos.
- **Responsividade**: Layout adaptado para diferentes resoluções, garantindo fluidez na navegação entre módulos.

## Técnica
- **Versão do Sistema**: Bump de `v2.1.0` (legado/placeholder) para `v0.5.0` (nova governança).
- **Consumo de API**: Integração via Axios com tratamento robusto de erros e re-tentativa manual.
