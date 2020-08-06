.PHONY: install setup deploy

install:
	npm install
	bash ./scripts/setup.sh

deploy:
	bash ./scripts/deploy.sh

