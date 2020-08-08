#!/bin/bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

rm -rd datasources/data
docker-compose -f datasources/docker-compose.yml up -d

until docker container exec -it postgresql pg_isready -h localhost &> /dev/null; do
  >&2 echo "Postgres is unavailable - wait"
  sleep 1
done


docker-compose -f docker-compose.yml up -d