# GPA Doações Dashboard

Sistema de gestão de campanhas de doação entre GPA e Connecting Food.

## 🚀 Como Rodar no VS Code

### 1. Pré-requisitos
- Node.js 18+ instalado
- VS Code com extensões:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Auto Rename Tag

### 2. Instalação

\`\`\`bash
# Clone ou baixe o projeto
# Navegue até a pasta do projeto

# Instale as dependências
npm install

# Rode o projeto em desenvolvimento
npm run dev
\`\`\`

### 3. Acesso
- Abra: http://localhost:3000
- Dashboard estará disponível

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── sidebar.tsx
│   ├── dashboard-*.tsx
│   └── ...
├── types/
│   └── index.ts         # Interfaces TypeScript
├── data/
│   ├── mock-data.json
│   └── sample-stores.ts
└── utils/
    └── excel-generator.ts
\`\`\`

## 🎯 Funcionalidades

### ✅ Implementadas
- **Dashboard Principal** - Métricas e visão geral
- **Gestão de Lojas** - CRUD de lojas GPA
- **Gestão de OSCs** - Organizações parceiras
- **Import Campanhas** - Sistema PRÉ/PÓS campanha
- **Analytics Avançados** - Gráficos Recharts
- **Notificações** - Sistema de alertas
- **Supabase Integration** - Banco de dados
- **Mobile Responsive** - Interface adaptativa

### 🔄 Em Desenvolvimento
- Integração API real
- Autenticação completa
- Relatórios PDF
- Dashboard tempo real

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **Supabase** - Backend/Database

## 📊 Dados Mock

O sistema usa dados simulados para demonstração:
- 61 lojas ativas
- 67 OSCs cadastradas
- 9.5k kg arrecadados
- 3 alertas ativos

## 🎨 Design System

- **Cores primárias**: Azul (#3B82F6)
- **Tipografia**: Inter
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Layout**: Sidebar + Main Content

## 📱 Responsividade

- **Desktop**: Layout completo
- **Mobile**: Interface adaptada
- **Tablet**: Híbrido responsivo

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run start    # Servidor produção
npm run lint     # Linting código
npm run type-check # Verificação tipos
\`\`\`

## 🚀 Deploy

O projeto está configurado para deploy em:
- Vercel (recomendado)
- Netlify
- Railway
- Render

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs no terminal
2. Confirme dependências instaladas
3. Teste em modo desenvolvimento
