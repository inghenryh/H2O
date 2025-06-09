# Usa Node 18 como base
FROM node:18

# Carpeta de trabajo en el contenedor
WORKDIR /app

# Copia los archivos al contenedor
COPY . .

# Instala dependencias
RUN npm install

# Expone el puerto del servidor web de Expo
EXPOSE 19006

# Comando por defecto: correr Expo para web
CMD ["npx", "expo", "start", "--web", "--tunnel"]
