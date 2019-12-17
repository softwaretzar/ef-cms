#!/bin/bash

# get aws account id if it does not exist in an env var
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-`aws sts get-caller-identity --query "Account"`}
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID%\"}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID#\"}"

$(aws ecr get-login --no-include-email --region us-east-1)
docker build -t "ef-cms-us-east-1" -f Dockerfile-CI .
docker tag "ef-cms-us-east-1:latest" "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest"

