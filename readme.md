# lifetrack

Suivi d'activités du quotidien : on déclare des activités (« courir », « boire un
café »), on les enregistre jour par jour depuis un calendrier, et on consulte des
statistiques par période.

## Structure

Trois paquets npm indépendants, sans workspace : chacun a son `package.json` et son
`package-lock.json`.

| Paquet          | Rôle                                                                  | Stack                                                     |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| `lifetracklib/` | Logique métier partagée : calendrier, moteur de statistiques, modèles | TypeScript, vitest                                        |
| `backend/`      | API REST                                                              | NestJS 11, Fastify, TypeORM, PostgreSQL 17, Auth0         |
| `frontend/`     | Application web                                                       | Angular 20 (standalone, zoneless), Bulma, chart.js, Auth0 |

**`lifetracklib` doit être construite en premier.** Les deux applications la consomment
par `file:../lifetracklib` et compilent contre son `dist/` : sans `npm run build` dans la
lib, leur build échoue.

Corollaire à connaître : ni `nest start --watch` ni `ng serve` ne surveillent
`node_modules/@lifetrack/lib`. Après avoir modifié la lib, il faut la reconstruire **et**
redémarrer le serveur de dev concerné.

## Démarrer

Le plus simple est le devcontainer (`.devcontainer/`), qui fournit Node, PostgreSQL et
pgAdmin. `postCreateCommand` lance `scripts/init_devcontainer.sh`, qui installe les trois
paquets et construit la lib.

Sans devcontainer :

```bash
cd lifetracklib && npm ci && npm run build
cd ../backend    && npm ci
cd ../frontend   && npm ci
```

Il faut aussi une base PostgreSQL joignable et un `backend/.env.local` (voir plus bas).

```bash
cd backend  && npm run start:dev   # API sur :5556
cd frontend && npm run start:dev   # app sur :4200
```

`scripts/launch_tmux_session.sh` lance les deux dans une session tmux.

## Variables d'environnement

Deux fichiers distincts, pour deux usages :

| Fichier              | Lu par                                           | Modèle                 |
| -------------------- | ------------------------------------------------ | ---------------------- |
| `backend/.env.local` | `npm run start:dev` et les scripts `migration:*` | `backend/.env.example` |
| `.env` (racine)      | `docker compose` en selfhosting                  | `.env.example`         |

`AUTH0_TENANT` **doit finir par un `/`** : le code concatène
`${AUTH0_TENANT}.well-known/jwks.json` et réutilise la valeur comme `issuer`. Sans le
slash, toutes les requêtes authentifiées répondent 401 sans message explicite.

## Base de données

Le schéma est géré par migrations TypeORM, jouées au démarrage de l'API
(`migrationsRun`). `synchronize` est désactivé : une modification d'entité demande une
migration.

```bash
cd backend
npm run migration:generate src/migrations/MaMigration
npm run migration:show
```

Un `migration:generate` sur un schéma à jour doit répondre « No changes in database
schema were found » : c'est le signal que les entités et les migrations sont alignées.

## Tests

```bash
cd lifetracklib && npm test -- --run     # vitest
cd backend      && npm test              # jest
cd frontend     && npm test              # karma, nécessite Chrome
```

La CI (`.github/workflows/ci.yml`) lance les trois suites, le contrôle de formatage des
trois paquets et ESLint sur le backend, à chaque push sur une PR ouverte vers `main` et
sur `main`.

## Selfhosting

`docker-compose.yaml` à la racine construit les images et démarre front, API et base. Il
attend un `.env` (voir `.env.example`) et ne publie que `127.0.0.1:8080` et
`127.0.0.1:5556` : le TLS et le routage `/api` sont assurés par un reverse proxy externe,
qui doit retirer le préfixe `/api` — l'API expose ses routes à la racine.

```bash
cp .env.example .env   # puis remplir
docker compose up -d --build
```

## Conventions

- Commits au format [Conventional Commits](https://www.conventionalcommits.org).
- TypeScript `strict` sur les trois paquets, une seule version (5.9.x).
- Formatage par prettier, configuration unique à la racine (`.prettierrc`).
