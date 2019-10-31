FROM node:8.16.2-jessie-slim

WORKDIR /home/build

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm i
RUN tar -czf puppeteer_lambda_layer.tar.gz nodejs

CMD echo "tar has been created"
