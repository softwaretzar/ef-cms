#!/bin/bash
docker build -t clamav -f Dockerfile .

if [[ "$CI" == "true" ]]; then
  docker run --name clamav -v /var/run/docker.sock:/var/run/docker.sock clamav
else
  docker run --name clamav clamav
fi

docker cp clamav:/home/build/clamav_lambda_layer.tar.gz .
docker rm clamav