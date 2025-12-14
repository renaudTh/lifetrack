#! /bin/bash
set -ue

pushd lifetracklib
  npm ci
  npm run build
popd 
pushd frontend
  npm install
popd
pushd backend
  npm ci
popd