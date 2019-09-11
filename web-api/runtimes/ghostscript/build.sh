#!/bin/bash
docker build -t ghostscript -f Dockerfile .

if [[ "$CI" == "true" ]]; then
  docker run --name ghostscript -v /var/run/docker.sock:/var/run/docker.sock ghostscript
else 
  docker run --name ghostscript ghostscript
fi

docker cp ghostscript:/home/build/ghostscript_lambda_layer.tar.gz .
docker rm ghostscript