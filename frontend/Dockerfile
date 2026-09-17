FROM node:24.5-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY lifetracklib/package*.json ./lifetracklib/

RUN cd lifetracklib && npm ci
RUN cd frontend && npm ci

COPY lifetracklib ./lifetracklib
COPY frontend ./frontend

RUN cd lifetracklib && npm run build

# L'URL de l'API est figee dans le bundle au build : une instance = une image.
ARG API_URL=https://lifetrack.renaudlab.dev/api
RUN sed -i "s#apiUrl: '.*'#apiUrl: '${API_URL}'#" frontend/src/environments/environment.ts

RUN cd frontend && npm run build -- --configuration production

FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist/frontend/browser /usr/share/nginx/html
