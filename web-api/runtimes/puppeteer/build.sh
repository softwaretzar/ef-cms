#!/bin/bash
docker build -t puppeteer -f Dockerfile .

if [[ "$CI" == "true" ]]; then
  docker run --name puppeteer -v /var/run/docker.sock:/var/run/docker.sock puppeteer
else 
  docker run --name puppeteer puppeteer
fi

docker cp puppeteer:/home/build/puppeteer_lambda_layer.tar.gz .
docker rm puppeteer
