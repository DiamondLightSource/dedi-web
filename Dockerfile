# syntax=docker/dockerfile:1

# ---- Build: install the exact lockfile dependencies and build the static site
FROM docker.io/library/node:24-alpine AS build
WORKDIR /app

# Copy the manifests first so the dependency layer is cached between builds
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Serve from the root of the container, not the GitHub Pages sub-path
ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}
RUN npm run build

# ---- Runtime: static files only, served by nginx as a non-root user on 8080
FROM docker.io/nginxinc/nginx-unprivileged:1.29-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
