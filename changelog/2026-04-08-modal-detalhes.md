# Fragmento de Changelog: Modal de Detalhes da Anamnese

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer)

## Funcionalidades
- **Novo Componente `AnamneseDetailModal.jsx`**: Implementado modal de visualização completa com layout de duas colunas (Relato Original vs Documento Estruturado).
- **Interatividade de Histórico**: Cards do histórico agora são clicáveis e possuem suporte a hover states, cursor dinâmico e animação de escala.
- **Micro-interações**: Adicionada animação de rotação e escala no botão de seta (`ChevronRight`) ao interagir com o card.

## UI/UX
- **Design System**: Implementado *Glassmorphism* no backdrop do modal com `backdrop-blur-md`.
- **Acessibilidade**: Adicionado suporte para fechar o modal via tecla `ESC` e clique externo.
- **Contraste**: Garantida a legibilidade clínica com tipografia Inter e cores Slate/Royal Blue.

## Técnica
- **Performance**: Reutilização integral dos dados do array de histórico (zero requisições extras ao servidor).
- **Animações**: Utilização de `animate-fade-in` e `animate-scale-up` para transições suaves de abertura e fechamento.
