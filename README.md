# Zaban Monorepo

Urdu programming language — monorepo with a publishable npm package and web playground.

## Structure

```
packages/
  zaban/     npm package — language + CLI (`npm i zaban-lang`)
  web/       React playground (deploy to Vercel / Netlify)
```

## Development

```bash
npm install
npm test      # run language tests
npm run dev   # playground dev server → http://localhost:5173
npm run build # build package + web
```

## Run programs (CLI)

```bash
npm run build -w zaban-lang
npm start -- run packages/zaban/examples/salam.zbn
```

## Publish to npm

From `packages/zaban`:

```bash
npm publish --access public
```

Package on npm: **[zaban-lang](https://www.npmjs.com/package/zaban-lang)**

## Deploy playground (Vercel / Netlify)

| Setting | Value |
|--------|--------|
| Root directory | repo root |
| Build command | `npm run build` |
| Output directory | `packages/web/dist` |

Set **install command** to `npm install` at the repo root so workspace dependencies resolve.

## Use as a library

```typescript
import { runSource } from "zaban-lang";

const lines = runSource(`shuru\n  likho "Salam"\nkhatam`);
```
