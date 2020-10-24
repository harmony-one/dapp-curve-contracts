FROM node:12

SHELL ["/bin/bash", "-c"]

WORKDIR /usr/bin/

COPY package.json package.json

COPY package-lock.json package-lock.json

RUN npm install

COPY scripts scripts

COPY tools tools

COPY build build

COPY config.js config.js

RUN chmod +x ./scripts/docker.sh

WORKDIR /root

ENTRYPOINT ["/usr/bin/scripts/docker.sh"]