FROM node:20.9-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY src/. ./
