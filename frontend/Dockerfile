FROM node:24.5-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY lifetracklib/package*.json ./lifetracklib/

RUN cd lifetracklib && npm install
RUN cd frontend && npm install

COPY frontend ./frontend
COPY lifetracklib ./lifetracklib

RUN cd lifetracklib && npm run build
RUN cd frontend && npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/frontend/dist/frontend/browser /usr/share/nginx/html