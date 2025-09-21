FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
ENV BASE_URL=https://fakerestapi.azurewebsites.net
CMD ["npm", "test"]