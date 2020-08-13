FROM node:10

ADD . /vpp_front

WORKDIR /vpp_front

RUN npm install
RUN npm run build
RUN npm install -g serve

ARG ENDPOINT
ARG PORT

ENV ENDPOINT ${ENDPOINT}
ENV PORT ${PORT}

CMD serve -s build