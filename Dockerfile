# Define a imagem base
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependências globais da raiz
COPY package*.json ./ 

# Instala as dependências globais
RUN npm install

# Define uma variável de ambiente para o serviço
ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

# Copia o serviço específico para o container
COPY ./services/${SERVICE_NAME} ./services/${SERVICE_NAME}

# Copia outros arquivos necessários
COPY .env .env
COPY ./routes ./routes
COPY ./models ./models
COPY ./controllers ./controllers
COPY ./middleware ./middleware

# Define a variável de ambiente para a porta
ARG PORT
ENV PORT=${PORT}

# Expõe a porta
EXPOSE ${PORT}

# Usa ENTRYPOINT para executar dinamicamente o serviço correto
ENTRYPOINT ["sh", "-c", "node /app/services/${SERVICE_NAME}/index.js"]