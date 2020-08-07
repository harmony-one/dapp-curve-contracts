.PHONY: install deploy check

install:
	npm install
	bash ./scripts/setup.sh

deploy:
	bash ./scripts/deploy.sh

test-checks:
	node ./tools/deploy/test/checks.js

