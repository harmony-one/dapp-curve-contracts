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

docker-build:
	docker build -t harmonyone/curve . --no-cache

docker-build-cached:
	docker build -t harmonyone/curve .

docker-upload:
	docker push harmonyone/curve