FROM manimcommunity/manim

WORKDIR /app

USER root

RUN apt update && apt install -y curl

# Install nodeJS
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm

COPY . .

RUN npm install
RUN npm run build

RUN mkdir scripts

ENTRYPOINT [ "npm", "run", "job"]