docker stop $(docker ps -a -q);

docker rm $(docker ps -a -q);

dokcer-compose build;

docker-compose up;