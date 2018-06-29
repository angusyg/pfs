FROM node:alpine

# Build args
ARG APP_NAME pfs
ARG APP_REPOSITORY https://github.com/angusyg/pfs

RUN apk add --no-cache \
  git \
  openssh \
  python \
  make \
  g++

USER node

# Install pm2
RUN npm install pm2 -g

# Install pm2 log rotate and configure it
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 10M
RUN pm2 set pm2-logrotate:retain 10
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
RUN pm2 set pm2-logrotate:rotateModule true
RUN pm2 set pm2-logrotate:workerInterval 30
RUN pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

WORKDIR /usr/src

# App cloning
RUN git clone ${APP_REPOSITORY} app

WORKDIR /usr/src/app

# App checkout master branch
RUN git checkout master

# App install
RUN npm install
RUN npm build
RUN npm prune --production

ENV NODE_ENV production
ENV PORT 3000
ENV TOKEN_SECRET JWTSECRET
ENV LOG_LEVEL info
ENV WEB_FOLDER /usr/src/app/web
ENV DB_FOLDER /usr/src/app/data
ENV LOG_FOLDER /usr/src/app/log
ENV PM2 true

# Expose app port
EXPOSE ${PORT}

# Monitor app with pm2
CMD ["pm2-runtime", "--json", "start", "pm2.config.js"]
