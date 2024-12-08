# PampaBooks: Aplicação Web em Microsserviços

**PampaBooks** é uma aplicação web para gestão de uma loja de livros online. A aplicação é dividida em microsserviços para gerenciar usuários, pedidos, avaliações e catálogos de livros. Cada microsserviço foi projetado para ser escalável, seguro e de alta disponibilidade.

---

## **Funcionalidades**

- **Gerenciamento de Usuários:** Cadastro, autenticação, perfis e atualização.
- **Gerenciamento de Catálogo:** Informações sobre livros, autores e categorias.
- **Gerenciamento de Pedidos:** Carrinho de compras, histórico e cálculo de custos.
- **Gerenciamento de Avaliações:** Publicação e listagem de avaliações de livros.

---

## **Tecnologias Utilizadas**

- **Backend:** Node.js com Express
- **Banco de Dados:** MongoDB
- **Autenticação:** JWT (JSON Web Tokens)
- **Containerização:** Podman
- **Orquestração:** Podman Pods
- **Gerenciamento de Dependências:** npm

---

## **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+
- MongoDB 6.0+
- Podman Desktop 1.13.0+

### **Passos**

1. **Clone o repositório:**
   git clone https://github.com/TKzErMaK/pampabooks.git
   cd pampabooks

2. **Instale as dependências:**

npm install

3. **Configure o arquivo .env: Crie um arquivo .env na raiz do projeto com as seguintes variáveis:**

# Usuários
MONGO_URI_USERS=mongodb://localhost:27017/pampabooks-users

# Avaliações
MONGO_URI_REVIEWS=mongodb://localhost:27017/pampabooks-reviews

# Pedidos
MONGO_URI_REQUESTS=mongodb://localhost:27017/pampabooks-requests

# Catálogos
MONGO_URI_CATALOGS=mongodb://localhost:27017/pampabooks-catalogs

# Portas
PORT_USERS=3000
PORT_REVIEWS=3001
PORT_REQUESTS=3002
PORT_CATALOGS=3003

# JWT Secret
JWT_SECRET=EZoRIkhy@lM7

4. **Crie o Podman Pod:**

podman pod create --name pampabooks-pod -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 -p 27017:27017

5. **Construa os serviços:**

podman build --build-arg SERVICE_NAME=users --build-arg PORT=3000 -t pampabooks-users-service .
podman build --build-arg SERVICE_NAME=reviews --build-arg PORT=3001 -t pampabooks-reviews-service .
podman build --build-arg SERVICE_NAME=requests --build-arg PORT=3002 -t pampabooks-requests-service .
podman build --build-arg SERVICE_NAME=catalogs --build-arg PORT=3003 -t pampabooks-catalogs-service .

6. **Inicie os containers:**

podman run -d --pod pampabooks-pod --name pampabooks-users-service pampabooks-users-service
podman run -d --pod pampabooks-pod --name pampabooks-reviews-service pampabooks-reviews-service
podman run -d --pod pampabooks-pod --name pampabooks-requests-service pampabooks-requests-service
podman run -d --pod pampabooks-pod --name pampabooks-catalogs-service pampabooks-catalogs-service
podman run -d --pod pampabooks-pod --name mongodb docker.io/mongodb/mongodb-community-server:latest

7. **Testando os Endpoints:**

Você pode realizar testes no PampaBooks de duas maneiras: via Postman (ou cURL) e através da interface gráfica desenvolvida.

7. 1. 1. Serviço de Usuários

Registro de Usuário:

POST http://localhost:3000/users/register
Body: { "name": "Teste", "email": "teste@email.com", "password": "123456" }

Login:

POST http://localhost:3000/users/login
Body: { "email": "teste@email.com", "password": "123456" }

7. 1. 2. Serviço de Avaliações

Criar Avaliação:

POST http://localhost:3001/reviews
Body: { "livroId": "1", "userId": "USER_ID", "comentario": "Ótimo!", "nota": 5 }

7. 1. 3. Serviço de Pedidos

Criar Pedido:

POST http://localhost:3002/requests
Body: { "userId": "USER_ID", "itens": [ { "livroId": "1", "quantidade": 2 } ], "total": 50.00 }

7. 1. 4. Serviço de Catálogo

Adicionar Livro:

POST http://localhost:3003/catalogs
Body: { "titulo": "Livro Teste", "autor": "Autor", "descricao": "Descrição", "categoria": "Ficção", "preco": 29.99, "estoque": 10 }

7. 2. Testando via Interface Gráfica

A interface gráfica foi projetada para permitir que os usuários interajam com os serviços diretamente no navegador.

Acesse o frontend

Abra o navegador e insira a URL correspondente ao serviço:

Usuários: http://localhost:8080/users/users.html

Avaliações: http://localhost:8080/reviews/reviews.html

Pedidos: http://localhost:8080/requests/requests.html

Catálogo: http://localhost:8080/catalogs/catalogs.html

Operações disponíveis na interface gráfica:

# Usuários:
Realizar login ou cadastro.

# Catálogo:
Adicionar livros ao catálogo.

# Avaliações:
Criar avaliações para livros.

# Pedidos:
Criar novos pedidos e visualizar itens no carrinho.

Testando a interação

Faça login no sistema através da página users.html.

Após autenticar-se, navegue pelas páginas de Catálogo, Avaliações ou Pedidos para realizar as operações correspondentes.

Verificando os resultados:

Os dados enviados são processados pelos microsserviços e armazenados no banco de dados MongoDB. Você pode verificar no banco de dados ou no navegador, conforme as mensagens de sucesso ou erro exibidas na interface.

**Vídeo de Demonstração**

Acesse o vídeo no link:

https://www.youtube.com/watch?v=eafP4NBIM7Q

**Documentação da API**

Cada microsserviço possui endpoints REST para gerenciamento. A documentação completa está disponível no formato OpenAPI. Consulte o arquivo docs/openapi.yaml.

**Contribuição**

1. Faça um fork do projeto.

2. Crie uma branch para sua feature:

git checkout -b minha-feature

3. Realize as alterações e faça commit:

git commit -m "Descrição da minha feature"

4. Faça push para sua branch:

git push origin minha-feature

5. Crie um Pull Request.