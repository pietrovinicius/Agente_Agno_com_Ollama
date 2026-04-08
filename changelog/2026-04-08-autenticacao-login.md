# Fragmento de Changelog: Sistema de Autenticação e Proteção de Rotas

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer & Security Specialist)
**Versão:** v0.6.0

## Funcionalidades
- **Sistema de Autenticação (Backend)**: Implementação de Token Authentication via DRF. Criados endpoints para `/api/auth/register/` e `/api/auth/login/`.
- **Blindagem de Endpoints**: Todos os endpoints de processamento clínico e histórico agora exigem o header `Authorization: Token <key>`.
- **Roteamento Protegido (Frontend)**: Integração do `react-router-dom` com componente `ProtectedRoute`, impedindo acesso ao dashboard por usuários anônimos.
- **Fluxo de Sessão**: Persistência de token no `localStorage` e interceptor Axios para detecção automática de sessões expiradas (401).

## UI/UX Pro Max
- **LoginPage.jsx**: Interface de login com estética *Glassmorphism*, validação em tempo real e feedback de carregamento.
- **RegisterPage.jsx**: Interface de cadastro seguindo os padrões de autoridade médica (Royal Blue).
- **Dashboard Isolado**: Refatoração da lógica principal para um componente dedicado, melhorando a manutenibilidade do SPA.

## Segurança
- **Hash de Senhas**: Utilização do motor nativo do Django para armazenamento seguro de credenciais.
- **CORS & Permissions**: Refinamento das políticas de segurança para garantir que apenas requisições autorizadas acessem o motor de IA e a base de conhecimento.
