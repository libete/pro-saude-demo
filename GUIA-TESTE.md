# 🚀 GUIA RÁPIDO DE TESTE - PRO DEMO

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Extrair e Abrir

```bash
# Extraia o arquivo pro-demo.zip
# Abra o arquivo index.html no seu navegador
```

Ou simplesmente:
- **Dê duplo clique** em `index.html`

---

## 🎯 Roteiro de Teste Recomendado

### **TESTE 1: Portal do Agente (3 minutos)**

1. Na landing page, clique em **"Portal do Agente"**

2. Na tela de login (popup):
   - Nome: `Maria Silva`
   - UBS: `1` (UBS Centro)

3. **Gere um link de triagem:**
   - Nome da Gestante: `Ana S.`
   - Canal: WhatsApp
   - Clique em **"Gerar Link de Triagem"**

4. **Copie o link gerado:**
   - Clique em **"📋 Copiar Link"**
   - Veja o toast de confirmação

5. **Gere mais 2 links** (com nomes diferentes)

6. **Observe os KPIs atualizados:**
   - Links Gerados: 3
   - Taxa de Abertura: 0% (ainda ninguém abriu)

7. **[OPCIONAL] Popular com dados mock:**
   - No footer, clique em **"🎲 Popular com 20 registros"**
   - Veja a tabela preencher com dados simulados

---

### **TESTE 2: Triagem da Gestante (2 minutos)**

1. **Cole o link copiado** em uma nova aba
   - Ou volte à landing e clique em "Fazer Triagem"

2. **Passo 1 - Informações Básicas:**
   - Idade Gestacional: `28` semanas
   - Sua Idade: `18 a 34 anos`
   - Clique **"Continuar →"**

3. **Passo 2 - Sinais de Alarme:**
   - Marque: **"Cefaleia intensa"**
   - Marque: **"Febre"**
   - Clique **"Continuar →"**

4. **Passo 3 - Histórico:**
   - Marque: **"Hipertensão"**
   - Clique **"✓ Finalizar Triagem"**

5. **Veja o Resultado:**
   - Badge: **⚠️ Risco Alto**
   - Orientações personalizadas
   - Mensagem sobre regulação prioritária

---

### **TESTE 3: Verificar Atualização (1 minuto)**

1. **Volte ao Portal do Agente** (aba anterior)

2. **Observe as mudanças:**
   - Status do link mudou para: **"✅ Concluído"**
   - Taxa de Abertura aumentou
   - Taxa de Conclusão apareceu
   - KPIs atualizados em tempo real

3. **Filtre por status:**
   - Selecione **"✅ Concluídos"**
   - Veja apenas os links finalizados

---

## 🧪 Cenários de Teste Avançados

### **Cenário A: Emergência Obstétrica**

Triagem com:
- IG: `33` semanas
- Sintomas: **Sangramento ativo** + **Dor intensa**
- Resultado esperado: 🚨 **CRÍTICO**

### **Cenário B: Gestação de Baixo Risco**

Triagem com:
- IG: `30` semanas
- Idade: `25-34 anos`
- Sem sintomas, sem comorbidades
- Resultado esperado: ✅ **BAIXO**

### **Cenário C: Gestação Gemelar + Sintomas**

Triagem com:
- IG: `32` semanas
- Sintomas: **Contrações regulares**
- Histórico: **Gestação gemelar**
- Resultado esperado: ⚠️ **ALTO**

---

## 🔍 O Que Observar

### ✅ **No Portal do Agente:**
- [x] Links são gerados com tokens únicos
- [x] Tabela atualiza em tempo real
- [x] Filtros funcionam corretamente
- [x] KPIs calculam automaticamente
- [x] Botão "Reenviar" funciona
- [x] Dados persistem ao recarregar página

### ✅ **Na Triagem:**
- [x] Validação de token funciona
- [x] Navegação entre passos é fluida
- [x] Checkboxes marcados ficam destacados
- [x] Barra de progresso atualiza
- [x] Classificação de risco é consistente
- [x] Mensagens são personalizadas por risco

### ✅ **Integração:**
- [x] Link gerado → triagem → atualiza agente
- [x] Status muda de "Não aberto" → "Concluído"
- [x] Ticket é criado automaticamente (console)
- [x] KPIs refletem mudanças imediatamente

---

## 🐛 Troubleshooting

### Problema: "Link Inválido ou Expirado"
**Solução:** O token não existe no localStorage. Gere um novo link no Portal do Agente.

### Problema: KPIs não atualizam
**Solução:** Recarregue a página do Portal do Agente (F5).

### Problema: Dados sumiram
**Solução:** O localStorage foi limpo. Clique em "Popular com 20 registros" ou gere novos links.

### Resetar Tudo:
```javascript
// No console do navegador:
ProData.resetDemo()
```

---

## 📊 Dados de Exemplo para Teste

### 5 Gestantes para Testar:

| Nome     | IG  | Sintomas              | Histórico     | Risco Esperado |
|----------|-----|-----------------------|---------------|----------------|
| Ana S.   | 28  | Cefaleia + Febre      | Hipertensão   | ALTO           |
| Maria J. | 35  | Sangramento           | -             | CRÍTICO        |
| Clara P. | 30  | Nenhum                | -             | BAIXO          |
| Julia M. | 32  | Contrações            | Gemelar       | ALTO           |
| Rita O.  | 22  | Movimento reduzido    | Diabetes      | ALTO           |

---

## 🎬 Sequência para Demonstração

### Para Avaliadores / Stakeholders:

1. **Abertura (30s)**
   - Mostre a landing page
   - Explique o conceito da PRO

2. **Portal do Agente (2min)**
   - Faça login
   - Gere 1-2 links
   - Mostre os KPIs zerados

3. **Triagem (2min)**
   - Cole o link em nova aba
   - Preencha um caso de ALTO risco
   - Mostre o resultado visual

4. **Retorno ao Agente (1min)**
   - Volte à aba do agente
   - Mostre status atualizado
   - Mostre KPIs atualizados

5. **Popular Mock (30s)**
   - Clique em "Popular 20 registros"
   - Mostre tabela com histórico
   - Aplique filtros

6. **Fechamento (30s)**
   - Destaque: "Sem nova senha, sem novo sistema"
   - Enfatize: "Decisões mais rápidas com mesma qualidade"

**Tempo total:** ~7 minutos

---

## 💡 Mensagens-Chave para Apresentação

1. **"Não substitui - potencializa"**
   - A PRO não é mais um sistema
   - É uma camada de inteligência sobre o SISREG

2. **"Zero fricção"**
   - Regulador não muda senha
   - Não aprende novo sistema
   - Continua no fluxo atual

3. **"Tempo é vida"**
   - Casos críticos aparecem primeiro
   - Confirmação em 1 clique
   - Menos tempo no sistema = mais tempo na decisão clínica

4. **"Dados para gestão"**
   - SES vê indicadores em tempo real
   - Identifica gargalos
   - Toma decisões estratégicas

---

## ✅ Checklist Antes de Apresentar

- [ ] Testar todos os fluxos uma vez
- [ ] Limpar localStorage (`ProData.resetDemo()`)
- [ ] Fechar outras abas do navegador
- [ ] Aumentar zoom se apresentar em projetor (Ctrl/Cmd +)
- [ ] Ter 2-3 nomes de gestantes preparados
- [ ] Conhecer os 4 níveis de risco
- [ ] Testar copiar/colar link entre abas

---

## 🎯 Próximos Passos (Após Demo)

1. Coletar feedback sobre:
   - Clareza dos fluxos
   - Usabilidade da interface
   - Relevância da classificação de risco
   - Utilidade dos KPIs

2. Validar:
   - Critérios de classificação com equipe clínica
   - Pertinência dos indicadores com gestores
   - Viabilidade técnica com TI

3. Iterar:
   - Ajustar critérios de risco se necessário
   - Adicionar campos relevantes omitidos
   - Refinar mensagens e orientações

---

**🏥 Boa sorte com a demonstração!**

*Se encontrar problemas ou tiver sugestões, consulte o README.md completo.*
