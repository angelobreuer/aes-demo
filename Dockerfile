FROM node:16-alpine AS build
WORKDIR /build
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM docker.angelobreuer.de/singlepageserver
COPY --from=build /build/dist /app/wwwroot