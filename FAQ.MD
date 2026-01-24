# Base de Conhecimento - Assistente de Anamnese (Agno/Llama)

Este documento serve como referência central para protocolos clínicos, funcionamento do sistema de IA e diretrizes de privacidade.

---

## 1. Protocolos Clínicos Críticos

### Fluxo de Sepse
**Objetivo:** Identificação e tratamento precoce para reduzir mortalidade.

| Etapa | Ação Imediata | Tempo Alvo |
|-------|---------------|------------|
| **Triagem** | Identificar qSOFA ≥ 2 ou SIRS. | < 10 min |
| **Diagnóstico** | Coletar **Lactato** arterial e Hemoculturas (2 pares). | < 30 min |
| **Tratamento** | Iniciar **Antibiótico de amplo espectro** e Reposição volêmica (30ml/kg) se hipotensão. | **< 1 hora** (Golden Hour) |

### Protocolo de Dor Torácica
**Objetivo:** Diagnóstico diferencial de Síndrome Coronariana Aguda (SCA).

1.  **Eletrocardiograma (ECG):** Deve ser realizado e interpretado em até **10 minutos** da admissão.
2.  **Marcadores de Necrose:** Solicitar Troponina ultrassensível na admissão (0h) e reavaliar em 1h ou 3h conforme protocolo institucional.
3.  **Estratificação:** Utilizar escore HEART para decisão de alta vs internação em casos de ECG não diagnóstico.

### Protocolo de AVC (Acidente Vascular Cerebral)
**Objetivo:** Reperfusão cerebral rápida em AVC Isquêmico.

-   **Janela Terapêutica:** Trombólise endovenosa (Alteplase) permitida até **4,5 horas** do ictus (início dos sintomas).
-   **Imagem:** TC de Crânio sem contraste imediata (< 20 min) para descartar AVC Hemorrágico.
-   **Critérios de Exclusão (Check-list):**
    -   AVC isquêmico ou TCE nos últimos 3 meses.
    -   Hemorragia intracraniana prévia.
    -   PAS > 185 mmHg ou PAD > 110 mmHg refratária.
    -   Uso de anticoagulantes (INR > 1.7).

---

## 2. Uso do Sistema e IA

### Como a IA sugere o CID-10?
O Agente Agno analisa o texto livre digitado na anamnese, extrai os sintomas principais e cruza com a base da Classificação Internacional de Doenças.
> **Atenção:** O CID apresentado é apenas uma **sugestão**. O médico é inteiramente responsável por validar e **Aprovar** o código final.

### Onde os dados são salvos?
A persistência dos dados é realizada integralmente no **Banco de Dados Oracle local** do hospital.
-   Nenhum dado clínico é armazenado na nuvem.
-   A infraestrutura é on-premise, garantindo soberania dos dados.

### Por que a IA alterou meu texto?
O sistema realiza uma "Refinamento Técnico" visando dois objetivos:
1.  **Auditoria e Faturamento:** Padronização de termos para conformidade com tabelas de convênios e SUS.
2.  **Clareza:** Correção ortográfica e expansão de abreviações ambíguas (ex: "dor em mmi" -> "dor em membros inferiores").

---

## 3. Segurança e Privacidade (LGPD)

### Os dados do paciente saem do hospital?
**Não.** O processamento da Inteligência Artificial (Llama 3.2 via Ollama) é executado 100% localmente no servidor da instituição.
-   Não há envio de dados para APIs externas (OpenAI, Anthropic, Google, etc).
-   O tráfego de dados ocorre apenas na rede interna (Intranet).

### Quem pode auditar as versões da anamnese?
O sistema mantém uma **Trilha de Auditoria (Audit Trail)** imutável contendo:
1.  **Versão Bruta:** O texto exato digitado pelo médico.
2.  **Sugestão IA:** O processamento gerado pelo algoritmo.
3.  **Versão Final:** O texto aprovado/editado pelo médico e salvo no banco.
*Acesso restrito à diretoria clínica e comitê de ética.*

---

## 4. Rotina de Emergência

### Como registrar uma alergia grave durante o preenchimento rápido?
Ao digitar a anamnese, utilize CAIXA ALTA ou asteriscos para destacar alergias críticas no texto.
*Exemplo:* `Paciente com dispneia e febre. **ALÉRGICO A PENICILINA**. Nega comorbidades.`
A IA é treinada para preservar e destacar alertas de segurança na versão final.

### O que fazer se a sugestão da IA estiver incorreta?
A inteligência artificial é uma ferramenta de apoio, não de decisão.
1.  Clique no botão **"Editar Manualmente"**.
2.  Corrija o texto ou o código CID conforme seu julgamento clínico.
3.  Só então clique em "Aprovar Sugestão".
