FROM node:20-alpine AS base

### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git

# Creation de l'espace de travail
WORKDIR /app

# Copie du package.json et package-lock.json
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Builder
FROM base AS builder

WORKDIR /app

# Copie des dépendances installées depuis l'étape deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construction de l'application
RUN npm run build

### Production image runner ###
FROM base AS runner

# Definition de l'environnement de production
ENV NODE_ENV=production

# Créer un utilisateur non-root pour Next.js
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next     
RUN chown nextjs:nodejs .next

# Copie des fichiers construits à partir de l'étape builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Utilisation de l'user non-root pour la production
USER nextjs

# Port exposé pour le proxy inverse ou K8s
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Lancement de l'application
CMD ["node", "server.js"]
