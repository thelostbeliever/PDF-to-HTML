FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
  wget curl git make cmake g++ pkg-config \
  poppler-utils libpoppler-dev libjpeg-dev \
  fontforge libpng-dev libgif-dev \
  libfreetype6-dev python3 python3-pip \
  build-essential automake \
  libxml2-dev libxslt1-dev \
  nodejs npm && \
  rm -rf /var/lib/apt/lists/*

# Install pdf2htmlEX from GitHub (stable build)
RUN git clone https://github.com/pdf2htmlEX/pdf2htmlEX.git && \
  cd pdf2htmlEX && \
  cmake . && \
  make && \
  make install

# Set working directory
WORKDIR /app

# Copy app files
COPY package.json ./
RUN npm install
COPY . .

# Create upload/output folders
RUN mkdir -p uploads output

EXPOSE 3000

CMD ["npm", "start"]