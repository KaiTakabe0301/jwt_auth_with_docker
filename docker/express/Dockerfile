FROM node:16.15.0-buster-slim

WORKDIR /usr/src/app

RUN apt-get upgrade

RUN yarn global add express-generator@4 nodemon

COPY ./docker/express/init-script/entrypoint.sh /tmp

ENTRYPOINT ["/tmp/entrypoint.sh"]

CMD ["node"]