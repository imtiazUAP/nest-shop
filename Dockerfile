FROM node:14.17.1 AS builder
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY ./src ./src
RUN npm run build


FROM node:14.17.1-alpine
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install --production --no-optional
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD [ "node dist/main.js" ]
ENTRYPOINT [ "sh", "-c" ]