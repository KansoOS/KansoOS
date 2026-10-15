# Orchestration locale de la vitrine KansoOS : fait tourner les sous-projets
# synchronisés (backend-mdm, dashboard-web) sans avoir à connaître leurs
# commandes internes à chacun. `infra` n'a pas encore de contenu à lancer.
#
# Ne modifie jamais backend-mdm/ ou dashboard-web/ directement : ce sont des
# copies synchronisées en lecture seule (voir README.md) — tout changement
# de code passe par leur repo source respectif.
#
# Tourne à côté d'un checkout de dev habituel sans collision : ports dédiés
# (3100/5433/8181, posés par `make setup`) + noms de projet Docker Compose
# dédiés (BACKEND_PROJECT/DASHBOARD_PROJECT ci-dessous), qui dérivent les noms
# de conteneurs/volume/réseau à la place des noms figés "-dev" habituels.

BACKEND := backend-mdm
DASHBOARD := dashboard-web
BACKEND_PROJECT := kanso-vitrine-mdm
DASHBOARD_PROJECT := kanso-vitrine-dashboard

.PHONY: help setup up down restart migrate logs-backend logs-dashboard test build clean

help:
	@echo "make setup          - crée les .env manquants (secrets + ports dédiés à la vitrine)"
	@echo "make up             - lance backend + dashboard en Docker, applique les migrations"
	@echo "make down           - arrête les deux"
	@echo "make restart        - down puis up"
	@echo "make migrate        - applique les migrations Prisma du backend"
	@echo "make logs-backend   - logs du backend en continu"
	@echo "make logs-dashboard - logs du dashboard en continu"
	@echo "make test           - lance les tests des deux"
	@echo "make build          - vérifie que les deux compilent"
	@echo "make clean          - down + supprime les volumes (perte des données locales)"
	@echo ""
	@echo "Backend  : http://localhost:3100"
	@echo "Dashboard: http://localhost:8181"

setup:
	@./scripts/setup-env.sh

up: setup
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) npm run docker:up
	$(MAKE) migrate
	cd $(DASHBOARD) && COMPOSE_PROJECT_NAME=$(DASHBOARD_PROJECT) npm run docker:up
	@echo ""
	@echo "Backend  : http://localhost:3100"
	@echo "Dashboard: http://localhost:8181"

down:
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) npm run docker:down
	cd $(DASHBOARD) && COMPOSE_PROJECT_NAME=$(DASHBOARD_PROJECT) npm run docker:down

restart: down up

migrate:
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) docker compose exec app npx prisma migrate deploy

logs-backend:
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) npm run docker:logs

logs-dashboard:
	cd $(DASHBOARD) && COMPOSE_PROJECT_NAME=$(DASHBOARD_PROJECT) npm run docker:logs

test:
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) docker compose exec app npm test
	cd $(DASHBOARD) && npm test -- run

build:
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) docker compose exec app npm run build
	cd $(DASHBOARD) && npm run build

clean: down
	cd $(BACKEND) && COMPOSE_PROJECT_NAME=$(BACKEND_PROJECT) docker compose down -v
	cd $(DASHBOARD) && COMPOSE_PROJECT_NAME=$(DASHBOARD_PROJECT) docker compose down -v
