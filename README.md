# Pods in Box - E-commerce de Pods

Loja online de pods/vapes com painel administrativo completo.

## 🚀 Tecnologias

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

**Backend:**
- Node.js + Express
- MongoDB Atlas
- Cloudinary (imagens)
- JWT Auth

## 📦 Instalação Local

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd pods-in-box

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Execute o projeto
npm run start
```

## ☁️ Deploy em Produção

### Pré-requisitos

Crie contas gratuitas em:
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Banco de dados
- [Cloudinary](https://cloudinary.com/) - Armazenamento de imagens
- [Railway](https://railway.app/) - Backend
- [Vercel](https://vercel.com/) - Frontend

### 1. Configurar MongoDB Atlas

1. Crie um cluster gratuito (M0)
2. Crie um usuário de database
3. Adicione `0.0.0.0/0` na whitelist de IPs
4. Copie a connection string (formato: `mongodb+srv://...`)

### 2. Configurar Cloudinary

1. Crie uma conta
2. No dashboard, copie:
   - Cloud Name
   - API Key
   - API Secret

### 3. Deploy do Backend (Railway)

1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=uma-chave-secreta-forte
   CLOUDINARY_CLOUD_NAME=seu-cloud-name
   CLOUDINARY_API_KEY=sua-api-key
   CLOUDINARY_API_SECRET=seu-api-secret
   FRONTEND_URL=https://seu-app.vercel.app
   PORT=3001
   ```
3. Configure o start command: `node server/index.js`
4. Deploy!
5. Anote a URL do backend (ex: `https://seu-app.railway.app`)

### 4. Migrar Dados Existentes

Antes do deploy, migre os dados do `db.json`:

```bash
# Configure MONGODB_URI no .env local
node server/scripts/migrate-data.js
```

### 5. Deploy do Frontend (Vercel)

1. Conecte seu repositório GitHub à Vercel
2. Configure a variável de ambiente:
   ```
   VITE_API_URL=https://seu-backend.railway.app/api
   ```
3. Deploy!

### 6. Atualizar Imagens dos Produtos

Após o deploy, acesse o painel admin e faça re-upload das imagens dos produtos (as antigas apontavam para localhost).

## 🔑 Credenciais Padrão

**Admin:**
- Email: `admin@podsinbox.com`
- Senha: `admin123`

## 📁 Estrutura do Projeto

```
├── src/               # Frontend React
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   └── lib/           # Utilitários e API client
├── server/            # Backend Express
│   ├── config/        # Configurações (MongoDB, Cloudinary)
│   ├── routes/        # Rotas da API
│   ├── middleware/    # Middlewares (auth)
│   ├── utils/         # Utilitários
│   └── scripts/       # Scripts (migração)
└── public/            # Assets estáticos
```

## 📝 Variáveis de Ambiente

Veja `.env.example` para a lista completa de variáveis necessárias.
