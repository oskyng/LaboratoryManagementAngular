
# Stage 1: Build the Angular application
# Usa una imagen de Node.js para construir la aplicación.
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos de configuración de dependencias.
# Usar un COPY separado para package.json y package-lock.json permite a Docker
# cachear esta capa si las dependencias no cambian.
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto.
# Usar npm ci para instalaciones limpias y más rápidas.
RUN npm ci --force

# Copia el resto del código de la aplicación.
COPY . .

# Construye la aplicación Angular en modo producción.
# Esto generará los archivos estáticos en la carpeta 'dist'.
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
# Usa una imagen ligera de Nginx para servir los archivos estáticos.
FROM nginx:alpine

# Copia la configuración personalizada de Nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación construida desde la etapa de construcción.
COPY --from=build /app/dist/laboratory-management-angular/browser /usr/share/nginx/html

# Expone el puerto 80, que es el puerto por defecto de Nginx.
EXPOSE 80

# El comando por defecto para iniciar Nginx.
CMD ["nginx", "-g", "daemon off;"]
