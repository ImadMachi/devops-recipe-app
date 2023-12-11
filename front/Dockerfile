FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as PRODUCTION_IMAGE

WORKDIR /app/frontend

COPY --from=BUILD_IMAGE /app/frontend/dist/ /app/frontend/dist/

EXPOSE 5173

COPY package.json .
COPY vite.config.ts .

RUN npm install typescript

CMD ["npm", "run", "preview"]
