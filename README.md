# Dedi-web

[![dedi-web code CI](https://github.com/tizayi/dedi-web/actions/workflows/code.yml/badge.svg)](https://github.com/tizayi/dedi-web/actions/workflows/code.yml)
[![gh-pages](https://github.com/tizayi/dedi-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/tizayi/dedi-web/actions/workflows/deploy.yml)

https://tizayi.github.io/dedi-web/

DEtector DIstance (DEDI) is a client only Q-Range calculator. Based on the dedi perspective within DAWN science. Built using react, typescript, vite, mui, zustand, and h5web/lib.

## Start dev server

Start dev server

```bash
  cd dedi-web
  npm install .
  npm run dev
```

## Start in container

Start up in a container

```bash
  cd dedi-web
  docker build -t dedi-web .
  docker run -d dedi-web
```

## Test

Run tests with vitest

```bash
  cd dedi-web
  npm run test
```
