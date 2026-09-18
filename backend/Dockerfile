# Stage 1: Build NestJS
FROM node:24.5-alpine AS build

WORKDIR /app

COPY backend/package*.json ./backend/
COPY lifetracklib/package*.json ./lifetracklib/

RUN cd lifetracklib && npm ci
RUN cd backend && npm ci

COPY lifetracklib ./lifetracklib
COPY backend ./backend

RUN cd lifetracklib && npm run build
RUN cd backend && npm run build

# Stage 2: Run in production mode
FROM node:24.5-alpine

WORKDIR /app

# The library resolves through `file:../lifetracklib` from backend/package.json:
# it must exist at that relative path when npm ci runs.
COPY --from=build /app/lifetracklib/package.json /lifetracklib/package.json
COPY --from=build /app/lifetracklib/dist /lifetracklib/dist

COPY --from=build /app/backend/package*.json ./
# --install-links copies the library into node_modules/ instead of symlinking it
# to /lifetracklib, from where its own imports (dayjs) would not resolve.
RUN npm ci --omit=dev --install-links

COPY --from=build /app/backend/dist ./dist

CMD ["node", "dist/main.js"]
