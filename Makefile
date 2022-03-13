include .env

.PHONE: build

build:
	docker-compose build

.PHONY: up

up:
	docker-compose up -d

.PHONE: down

down:
	docker-compose down
	
.PHONE: logs

logs:
	docker-compose logs -f