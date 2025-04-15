FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y \
    fontforge \
    poppler-utils \
    libpoppler-dev \
    libjpeg-dev \
    git \
    make \
    cmake \
    g++ \
    pkg-config \
    libfontforge-dev \
    python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Clone and build pdf2htmlEX (optional if it's working)
# RUN git clone https://github.com/coolwanglu/pdf2htmlEX.git /pdf2htmlEX && \
#     cd /pdf2htmlEX && make && make install

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]