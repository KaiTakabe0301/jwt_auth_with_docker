FROM node:16.15.0-buster-slim

WORKDIR /usr/src/app

RUN apt-get upgrade

RUN yarn global add express-generator@4

COPY ./docker/express/init-script/entrypoint.sh /tmp

# RUN chmod 777 entrypoint.sh

ENTRYPOINT ["/tmp/entrypoint.sh"]

CMD ["node"]