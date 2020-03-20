# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN apt-get update
RUN apt-get install bash
RUN npm install --silent

EXPOSE 9000

# start app
CMD ["npm", "start"]