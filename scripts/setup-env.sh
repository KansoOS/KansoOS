#!/usr/bin/env bash
# Crée les .env manquants des sous-projets à partir de leurs .env.example.
# Idempotent : ne touche jamais à un .env déjà présent. Les .env sont
# gitignorés dans chaque repo source, donc jamais synchronisés ici — il faut
# les régénérer localement, une seule fois.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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
  # Remplace les placeholders "change_me" par de vrais secrets générés localement.
  sed -i.bak "s#^JWT_SECRET=.*#JWT_SECRET=${jwt_secret}#" "$env_file"
  sed -i.bak "s#^TOTP_ENCRYPTION_KEY=.*#TOTP_ENCRYPTION_KEY=${totp_key}#" "$env_file"
  rm -f "$env_file.bak"
  echo "backend-mdm/.env créé (secrets générés localement)."
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
  echo "dashboard-web/.env créé."
}

setup_backend
setup_dashboard
