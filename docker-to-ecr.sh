#!/bin/bash
ENVIRONMENT=$1

$(aws ecr get-login --no-include-email --region us-east-1)
docker build -t "ef-cms-${ENVIRONMENT}-us-east-1" -f Dockerfile-CI .
docker tag "ef-cms-${ENVIRONMENT}-us-east-1:latest" "515554424717.dkr.ecr.us-east-1.amazonaws.com/ef-cms-${ENVIRONMENT}-us-east-1:latest"
docker push "515554424717.dkr.ecr.us-east-1.amazonaws.com/ef-cms-${ENVIRONMENT}-us-east-1:latest"

