.PHONY: install deploy check

install:
	npm install
	bash ./scripts/setup.sh

test-deploy:
	bash ./scripts/deploy.sh

main-deploy:
	bash ./scripts/deploy.sh mainnnet

test-checks:
	node ./tools/deploy/test/checks.js

