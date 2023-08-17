# Dedi-web

[![dedi-web code CI](https://github.com/tizayi/dedi-web/actions/workflows/code.yml/badge.svg)](https://github.com/tizayi/dedi-web/actions/workflows/code.yml)

A browser tool to calculate the beam centering parameters. Like dedi within dawn science. Built using react and vite.

## Start dev server

Start up

```bash
  cd dedi-web
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
