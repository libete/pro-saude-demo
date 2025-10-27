# 🏥 PRO DEMO — Plataforma de Regulação Obstétrica

## 📌 Visão Geral

A **PRO DEMO** é uma demonstração interativa da Plataforma de Regulação Obstétrica, criada para apresentar como o sistema funciona na prática através das perspectivas de diferentes personas.

### ✨ O que é a PRO?

A PRO é uma **camada de inteligência** que se integra ao SISREG e aos fluxos clínicos existentes, apoiando reguladores e equipes de saúde na tomada de decisão rápida e qualificada em casos obstétricos.

**Não é mais uma plataforma — é uma forma melhor de trabalhar na plataforma que o regulador já usa.**

---

## 🚀 Como Usar a DEMO

### 1. Abra o arquivo `index.html` no navegador

Você verá 5 opções de entrada por persona:

- 👩‍🍼 **Gestante** - Fazer triagem obstétrica
- 🩺 **Agente de Saúde** - Gerar e acompanhar links de triagem
- 🧑‍⚕️ **Regulador** - Ver fila priorizada e confirmar encaminhamentos
- 🏥 **Gestor UBS** - Acompanhar gestantes da unidade
- 🏛️ **Admin SES** - Gerenciar unidades e indicadores

### 2. Fluxo Recomendado para Demonstração

**Passo a Passo Ideal:**

1. **Comece pelo Agente** (`agente.html`)
   - Faça login com seu nome e escolha uma UBS
   - Gere 2-3 links de triagem
   - Copie um dos links gerados

2. **Acesse como Gestante** (cole o link ou use o botão na landing)
   - Preencha os 3 passos da triagem
   - Veja a classificação de risco ao final
   - O ticket será criado automaticamente

3. **Volte ao Portal do Agente**
   - Veja que o status do link mudou para "Concluído"
   - Observe os KPIs atualizados

4. **[EM DESENVOLVIMENTO]** Acesse como Regulador
   - Veja o ticket na fila priorizada
   - Confirme encaminhamento com 1 clique

---

## 📁 Estrutura do Projeto

```
pro-demo/
├── index.html              # Landing page com seleção de persona
├── agente.html            # Portal do Agente de Saúde ✅
├── triagem.html           # Fluxo de triagem da gestante ✅
├── sisreg-mock.html       # SISREG simulado [EM DESENVOLVIMENTO]
├── plugin.html            # Plugin do regulador [EM DESENVOLVIMENTO]
├── ubs.html              # Painel Gestor UBS [EM DESENVOLVIMENTO]
├── admin.html            # Portal Administrativo SES [EM DESENVOLVIMENTO]
├── assets/
│   ├── css/
│   │   └── global.css    # Estilos globais ✅
│   └── js/
│       ├── mock-data.js  # Gerenciamento de dados ✅
│       └── pro-motor.js  # Motor de classificação ✅
└── README.md             # Este arquivo
```

---

## 🧩 Funcionalidades Implementadas

### ✅ **Portal do Agente** (`agente.html`)

**Funcionalidades:**
- Login mock (nome + UBS)
- Geração de links tokenizados de triagem
- Tabela com histórico de links enviados
- Filtros por status e período
- KPIs operacionais em tempo real:
  - Links gerados
  - Taxa de abertura
  - Taxa de conclusão
  - Tempo médio de resposta
- Botão de reenvio de links
- Popular demo com 20 registros mock
- Reset completo da demo

### ✅ **Triagem da Gestante** (`triagem.html`)

**Funcionalidades:**
- Validação de token via URL
- Fluxo de 3 passos mobile-first:
  1. Informações básicas (IG, idade)
  2. Sinais de alarme (sintomas críticos)
  3. Histórico de saúde (comorbidades)
- Classificação automática de risco via Motor PRO
- Resultado visual com badge colorido
- Orientações personalizadas por nível de risco
- Criação automática de ticket para regulação

### ✅ **Motor PRO** (`pro-motor.js`)

**Funcionalidades:**
- Classificação de risco em 4 níveis:
  - 🚨 **CRÍTICO** - Sangramento, DPP, pré-eclâmpsia grave
  - ⚠️ **ALTO** - Contrações, movimentação reduzida, cefaleia intensa
  - ⚡ **MODERADO** - Fatores de risco, idade, comorbidades
  - ✅ **BAIXO** - Gestação de rotina
- Geração de justificativas clínicas
- Mensagens personalizadas por risco
- Cálculo de prioridade para fila
- Ordenação inteligente de tickets

### ✅ **Gestão de Dados** (`mock-data.js`)

**Funcionalidades:**
- CRUD completo de links, tickets e agentes
- Persistência via localStorage
- Sistema de eventos (tracking detalhado)
- Expiração automática de tokens (72h)
- Deduplicação de gestantes via hash
- KPIs calculados em tempo real
- Helpers de formatação
- LRU automático (limite de 100 links)

---

## 🎯 Dados Simulados

### Status de Links
- **Não aberto** - Link gerado mas não acessado
- **Em progresso** - Gestante iniciou mas não finalizou
- **Concluído** - Triagem finalizada ✅
- **Venceu** - Token expirado (72h)

### Níveis de Risco
- **CRÍTICO** - Regulação imediata (< 30 min)
- **ALTO** - Regulação prioritária (< 4h)
- **MODERADO** - Regulação programada (< 24h)
- **BAIXO** - Acompanhamento na UBS

### Eventos Rastreados
- `LINK_GERADO` - Link criado pelo agente
- `LINK_COPIADO` - Copiado para área de transferência
- `WHATSAPP_ABERTO` - WhatsApp Web aberto
- `LINK_ABERTO` - Gestante acessou o link
- `PASSO_1/2/3` - Progresso na triagem
- `TRIAGEM_CONCLUIDA` - Triagem finalizada
- `REENVIO_1/2/3` - Tentativas de reenvio
- `TOKEN_EXPIRADO` - Link venceu

---

## 🧠 Lógica de Classificação de Risco

### Critérios CRÍTICOS (qualquer um = crítico)
- Sangramento ativo
- Dor abdominal intensa
- Perda de líquido (ruptura de bolsa)
- IG < 34s + sintomas de alarme
- Histórico de pré-eclâmpsia + cefaleia

### Critérios ALTOS
- Cefaleia intensa
- Febre
- Contrações regulares
- Movimentação fetal reduzida
- Prematura (< 37s) + comorbidades

### Critérios MODERADOS
- Idade de risco (< 18 ou > 40)
- Diabetes gestacional
- Hipertensão
- Gestação gemelar
- Prematura sem comorbidades

### BAIXO (padrão)
- Gestação sem fatores de risco identificados

---

## 🔐 Segurança & LGPD

### Na Demo:
- Dados totalmente fictícios
- Nome opcional (apenas iniciais recomendadas)
- Hash anônimo para deduplicação
- Sem CPF ou dados sensíveis

### Na Versão Real:
- Autenticação via Gov.br / SSO SES
- Dados anonimizados e pseudonimizados
- Logs de auditoria completos
- Conformidade com LGPD
- Revogação remota de acessos

---

## 📊 KPIs Demonstrados

### Portal do Agente:
- **Taxa de Abertura**: Links abertos / Links gerados
- **Taxa de Conversão**: Triagens concluídas / Links abertos
- **Taxa de Efetividade**: Triagens concluídas / Links gerados
- **Tempo Médio**: Tempo entre criação e conclusão
- **Reenvios Médios**: Média de tentativas por link

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização (variáveis CSS, Flexbox, Grid)
- **JavaScript Vanilla** - Lógica de negócio
- **localStorage** - Persistência de dados
- **Responsive Design** - Mobile-first

---

## 🧪 Testando a Demo

### Cenário 1: Gestação de Baixo Risco
1. Agente gera link
2. Gestante preenche: IG 28s, idade 25-34, sem sintomas, sem comorbidades
3. Resultado: **BAIXO** - Acompanhamento na UBS

### Cenário 2: Gestação de Alto Risco
1. Agente gera link
2. Gestante preenche: IG 35s, idade 35-40, cefaleia intensa, histórico de hipertensão
3. Resultado: **ALTO** - Regulação prioritária

### Cenário 3: Emergência Obstétrica
1. Agente gera link
2. Gestante preenche: IG 32s, sangramento ativo
3. Resultado: **CRÍTICO** - Regulação imediata

---

## 🔄 Reset da Demo

Há 3 formas de resetar:

1. **Botão no Portal do Agente** (footer)
2. **Botão na Landing Page** (footer)
3. **Console do navegador**: `ProData.resetDemo()`

Isso apaga TODOS os dados do localStorage.

---

## 🚧 Próximos Componentes

### Em Desenvolvimento:
- [ ] Plugin do Regulador
- [ ] SISREG Mock
- [ ] Painel Gestor UBS
- [ ] Portal Administrativo SES
- [ ] Wizard de ativação do plugin
- [ ] Simulação de RPA

---

## 📝 Observações Importantes

### Esta é uma DEMONSTRAÇÃO:
- ✅ Fluxos funcionais e navegáveis
- ✅ Dados persistem durante a sessão
- ✅ KPIs calculados em tempo real
- ❌ Não há backend real
- ❌ Não há integração com SISREG
- ❌ Não há autenticação real

### Objetivo:
Demonstrar como a PRO funciona end-to-end, validando:
- Usabilidade dos fluxos
- Lógica de classificação de risco
- Valor agregado para cada persona
- Impacto nos indicadores de gestão

---

## 💡 Dicas para Apresentação

1. **Comece pela Landing** - Explique o conceito geral
2. **Mostre o Agente** - Destaque a simplicidade de gerar links
3. **Faça uma Triagem** - Mostre a classificação em tempo real
4. **Volte ao Agente** - Mostre os KPIs atualizados
5. **[Futuro] Plugin** - Demonstre a fila priorizada

### Mensagens-Chave:
- "A PRO NÃO substitui o SISREG - ela o POTENCIALIZA"
- "Zero curva de aprendizado para o regulador"
- "Decisões mais rápidas SEM mais trabalho manual"
- "Dados estratégicos para gestão da rede"

---

## 🤝 Suporte

Para dúvidas sobre a demo ou sugestões:
- Consulte este README
- Inspecione o código (bem documentado)
- Verifique o console do navegador para logs

---

**🏥 PRO — Transformando a regulação obstétrica, um clique por vez.**
