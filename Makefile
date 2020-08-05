.PHONY: install setup deploy

install:
	npm install -g truffle
	npm install

setup:
	bash ./scripts/setup.sh

deploy:
	bash ./scripts/deploy.sh

