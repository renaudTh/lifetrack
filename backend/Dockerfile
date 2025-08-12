# Stage 1: Build NestJS
FROM node:24.5-alpine AS build

WORKDIR /app

# 1. Copier package.json pour chaque projet
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY lifetracklib/package*.json ./lifetracklib/

# 2. Installer dépendances backend
RUN cd backend && npm install
RUN cd lifetracklib && npm install

# 3. Copier le code complet
COPY backend ./backend
COPY lifetracklib ./lifetracklib

# 4. Build NestJS
RUN cd lifetracklib && npm run build
RUN cd backend && npm run build

# Stage 2: Run in production mode
FROM node:24.5-alpine

WORKDIR /app

COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package*.json ./

RUN npm install --omit=dev

CMD ["node", "dist/main.js"]