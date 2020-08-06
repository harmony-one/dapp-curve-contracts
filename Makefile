.PHONY: install deploy check

install:
	npm install
	bash ./scripts/setup.sh

deploy:
	bash ./scripts/deploy.sh

checks:
	node ./scripts/checks.js

