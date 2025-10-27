# 🩺 PRO - Plataforma de Regulação Otimizada

## 📋 Sobre o Projeto

Sistema de regulação obstétrica inteligente desenvolvido para otimizar o atendimento pré-natal e encaminhamento de gestantes na rede pública de saúde.

## ✨ Funcionalidades

- **📱 Triagem Online**: Formulário inteligente para gestantes via WhatsApp/Web
- **🧑‍⚕️ Painel do Agente**: Gerenciamento de links e acompanhamento local
- **🧑‍💻 Painel do Regulador**: Fila priorizada e decisão em 1 clique
- **🏥 Painel do Gestor**: Atualização de capacidade e gestão de unidade
- **🤖 Classificação Automática**: Sistema inteligente de estratificação de risco

## 🚀 Deploy no GitHub Pages

### Pré-requisitos
- Conta no GitHub
- Git instalado na máquina

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde)
3. Configure:
   - **Repository name**: `pro-saude-demo`
   - **Description**: `Demonstração do Sistema PRO de Regulação Obstétrica`
   - **Public** ✅ (marque como público)
   - **NÃO** marque "Add a README file"
4. Clique em **"Create repository"**

### Passo 2: Preparar Arquivos Localmente

Abra o terminal/prompt de comando e execute:

```bash
# Criar pasta do projeto
mkdir pro-saude-demo
cd pro-saude-demo

# Inicializar git
git init

# Copiar todos os arquivos HTML desta demonstração para a pasta
# (index.html, landing-page-minimalista.html, triagem-gestante.html, etc.)
```

### Passo 3: Fazer Commit e Push

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: adiciona demonstração completa do sistema PRO"

# Conectar com seu repositório (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/pro-saude-demo.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar para GitHub
git push -u origin main
```

### Passo 4: Ativar GitHub Pages

1. No seu repositório no GitHub, vá em **Settings** (Configurações)
2. No menu lateral, clique em **Pages**
3. Em **Source** (Fonte):
   - Branch: **main**
   - Folder: **/ (root)**
4. Clique em **Save**
5. Aguarde 1-2 minutos

### Passo 5: Acessar seu Site

Seu site estará disponível em:
```
https://SEU-USUARIO.github.io/pro-saude-demo/
```

## 📁 Estrutura de Arquivos

```
pro-saude-demo/
├── index.html                      # Página inicial (hub de navegação)
├── landing-page-minimalista.html   # Landing page do sistema
├── triagem-gestante.html           # Interface de triagem
├── painel-agente-saude.html        # Painel do agente
├── tela-regulador-hibrida.html     # Painel do regulador
├── painel-gestor-unidade.html      # Painel do gestor
└── README.md                       # Este arquivo
```

## 🎯 Como Usar a Demo

### Para Demonstrações

1. Acesse a página inicial: `https://seu-usuario.github.io/pro-saude-demo/`
2. Navegue pelos diferentes painéis usando os cards
3. Todos os dados são simulados e seguros para demonstração

### URLs Diretas

- **Landing Page**: `/landing-page-minimalista.html`
- **Triagem**: `/triagem-gestante.html`
- **Agente**: `/painel-agente-saude.html`
- **Regulador**: `/tela-regulador-hibrida.html`
- **Gestor**: `/painel-gestor-unidade.html`

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com gradientes e animações
- **JavaScript Vanilla**: Interatividade sem dependências
- **Design Responsivo**: Mobile-first approach
- **GitHub Pages**: Hospedagem gratuita

## 🔒 Segurança e Privacidade

- ✅ Nenhum dado real é coletado
- ✅ Todos os dados são simulados
- ✅ Não há backend ou banco de dados
- ✅ Funciona completamente offline após carregamento
- ✅ Sem cookies ou rastreamento

## 📊 Dados Simulados

Todos os dados de gestantes, unidades, capacidade e estatísticas são fictícios e criados apenas para fins de demonstração.

## 🤝 Contribuindo

Para sugerir melhorias ou reportar problemas:

1. Abra uma [Issue](../../issues)
2. Descreva o problema ou sugestão
3. Aguarde retorno da equipe

## 📝 Licença

Este é um projeto de demonstração desenvolvido para a Secretaria Estadual de Saúde do Rio de Janeiro.

## 👥 Equipe

Desenvolvido para otimizar o atendimento obstétrico na rede pública de saúde.

## 📞 Contato

Para mais informações sobre o projeto PRO, entre em contato com a Secretaria de Saúde.

---

**🩺 PRO - Plataforma de Regulação Otimizada**  
*Cuidado inteligente para mães e bebês*
