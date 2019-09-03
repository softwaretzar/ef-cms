#!/bin/bash

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then 
  echo 'dev'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'stg'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'prod'
elif [[ $BRANCH == 'circleci-deployment-refactor' ]] ; then
  echo 'joe'
else
  exit 1;
fi