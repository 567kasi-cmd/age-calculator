FROM node:20-bullseye

# install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install --production
COPY . .

EXPOSE 3000
CMD ["node","server.js"]
