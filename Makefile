install: install-deps

run:
	node bin/gendiff.js

install-deps:
	npm ci

test:
	npx -n --experimental-vm-modules jest
	npx eslint .

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish --dry-run