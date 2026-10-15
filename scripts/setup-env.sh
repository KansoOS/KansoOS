#!/usr/bin/env bash
# Crée les .env manquants des sous-projets à partir de leurs .env.example.
# Idempotent : ne touche jamais à un .env déjà présent. Les .env sont
# gitignorés dans chaque repo source, donc jamais synchronisés ici — il faut
# les régénérer localement, une seule fois.
#
# Ports et CORS dédiés (3100/5433/8181) pour pouvoir faire tourner la vitrine
# à côté d'un checkout de dev habituel sans collision (voir Makefile pour
# COMPOSE_PROJECT_NAME, qui évite la collision côté noms de conteneurs).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VITRINE_APP_PORT=3100
VITRINE_POSTGRES_PORT=5433
VITRINE_WEB_PORT=8181

setup_backend() {
  local dir="$ROOT_DIR/backend-mdm"
  local env_file="$dir/.env"

  if [ -f "$env_file" ]; then
    echo "backend-mdm/.env existe déjà, inchangé."
    return
  fi
  if [ ! -f "$dir/.env.example" ]; then
    echo "backend-mdm/.env.example introuvable — lance la synchro d'abord ?" >&2
    return 1
  fi

  cp "$dir/.env.example" "$env_file"
  local jwt_secret totp_key
  jwt_secret=$(openssl rand -base64 48)
  totp_key=$(openssl rand -base64 32)
  # Remplace les placeholders "change_me" par de vrais secrets générés localement,
  # et les ports/CORS par défaut par ceux dédiés à la vitrine.
  sed -i.bak "s#^JWT_SECRET=.*#JWT_SECRET=${jwt_secret}#" "$env_file"
  sed -i.bak "s#^TOTP_ENCRYPTION_KEY=.*#TOTP_ENCRYPTION_KEY=${totp_key}#" "$env_file"
  sed -i.bak "s#^APP_PORT=.*#APP_PORT=${VITRINE_APP_PORT}#" "$env_file"
  sed -i.bak "s#^POSTGRES_PORT=.*#POSTGRES_PORT=${VITRINE_POSTGRES_PORT}#" "$env_file"
  sed -i.bak "s#^CORS_ORIGIN=.*#CORS_ORIGIN=http://localhost:${VITRINE_WEB_PORT}#" "$env_file"
  rm -f "$env_file.bak"
  echo "backend-mdm/.env créé (secrets générés, port ${VITRINE_APP_PORT})."
}

setup_dashboard() {
  local dir="$ROOT_DIR/dashboard-web"
  local env_file="$dir/.env"

  if [ -f "$env_file" ]; then
    echo "dashboard-web/.env existe déjà, inchangé."
    return
  fi
  if [ ! -f "$dir/.env.example" ]; then
    echo "dashboard-web/.env.example introuvable — lance la synchro d'abord ?" >&2
    return 1
  fi

  cp "$dir/.env.example" "$env_file"
  sed -i.bak "s#^VITE_API_BASE_URL=.*#VITE_API_BASE_URL=http://localhost:${VITRINE_APP_PORT}#" "$env_file"
  rm -f "$env_file.bak"
  # WEB_PORT n'est lu que par docker-compose.yml (pas par l'app elle-même),
  # donc pas dans .env.example : on l'ajoute ici.
  echo "WEB_PORT=${VITRINE_WEB_PORT}" >> "$env_file"
  echo "dashboard-web/.env créé (port ${VITRINE_WEB_PORT})."
}

setup_backend
setup_dashboard
