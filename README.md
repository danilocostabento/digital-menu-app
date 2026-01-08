
# Digital Menu App

![GitHub repo size](https://img.shields.io/github/repo-size/danilocostabento/digital-menu-app?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/danilocostabento/digital-menu-app?style=for-the-badge)

<code><img height="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" alt="Typescript"/></code>
<code><img height="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="React"/></code>
<code><img height="32" src="https://vectorseek.com/wp-content/uploads/2025/05/Firebase-icon-Logo-PNG-SVG-Vector.png" alt="Firebase"/></code>
<code><img height="32" src="https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/sass/sass-original.svg" alt="Sass"/></code>

<img src="public/preview.png" alt="Preview do Digital Menu App" width="600">

> Sistema de cardápio digital para restaurantes, lanchonetes e bares. Permite cadastro, edição e exibição de itens do menu, com categorias, controle de estoque e painel administrativo com autenticação e permissões.

### Ajustes e melhorias

O projeto está em desenvolvimento. Próximas tarefas:

- [x] Autenticação com Firebase Auth
- [x] Painel admin com roles (USER, ADMIN, MASTER)
- [x] CRUD de itens do cardápio com categorias
- [x] Filtro público por categoria
- [x] Registro e promoção de usuários
- [ ] Configuração de ReCaptcha
- [ ] Upload de imagens para itens do menu
- [ ] Busca por texto no Menu
- [ ] Itens em Destaque
- [ ] Modo Offline via LocalStorage
- [ ] Paginação em todas as páginas
- [ ] Aumentar segurança
- [ ] Busca por nome e filtros no painel admin
- [ ] Duplicar itens
- [ ] Edição em modal
- [ ] Responsividade mobile aprimorada
- [ ] Notificações e feedbacks visuais

### Opcionais

O projeto pode conter:

- [ ] Sitema de Anotações internas em cada item (Para controle interno)
- [ ] Integração de Status do dia (Acompanhamento de top itens pedidos, etc)
- [ ] Exportar cardápio para backup
- [ ] Opção de Delivery indicando o whatsapp da Loja Ou no próprio site

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Node.js 18+ e npm instalados
- Acesso ao Firebase (Auth e Firestore)
- Variáveis de ambiente configuradas no arquivo `.env` (veja `.env.example`)

## 🚀 Instalando Digital Menu App

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/danilocostabento/digital-menu-app.git
cd digital-menu-app
npm install
```

Crie um arquivo `.env` com as credenciais do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## ☕ Usando Digital Menu App

Para rodar o projeto em modo desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 📫 Contribuindo para Digital Menu App

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_branch>`
5. Crie uma Pull Request.

Consulte também a [documentação do GitHub sobre Pull Requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.