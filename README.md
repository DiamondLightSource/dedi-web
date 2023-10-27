# Dedi-web

[![dedi-web code CI](https://github.com/tizayi/dedi-web/actions/workflows/code.yml/badge.svg)](https://github.com/tizayi/dedi-web/actions/workflows/code.yml)
[![gh-pages](https://github.com/tizayi/dedi-web/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/tizayi/dedi-web/actions/workflows/gh-pages.yml)

A client only Q-Range calculator. Based on dedi within dawn science. Built using react, typescript, mui, zustand, three.js, and h5web/lib.

https://tizayi.github.io/dedi-web/

## Start dev server

Start up

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
