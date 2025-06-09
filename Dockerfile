FROM node:20-bullseye

# 1. Instala Expo CLI globalmente
RUN npm install -g expo@latest

# 2. Copia manifest y dependencias
WORKDIR /app
RUN npm install -g expo @expo/ngrok
COPY package*.json ./
RUN npm ci --legacy-peer-deps --verbose

# 3. Copia el resto del código
COPY . .

# 4. Ajustes para que funcione el live-reload dentro de Docker
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
    REACT_NATIVE_PACKAGER_HOSTNAME=host.docker.internal \
    CHOKIDAR_USEPOLLING=true

# 5. Puertos típicos del dev-server Expo
EXPOSE 8081 19000 19001 19002 19006

CMD ["npx", "expo", "start", "--tunnel", "--clear"]

