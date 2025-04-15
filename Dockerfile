FROM ubuntu:22.04

# Install required dependencies and pdf2htmlEX
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    make \
    cmake \
    g++ \
    pkg-config \
    libfontforge-dev \
    poppler-utils \
    libpoppler-dev \
    libjpeg-dev \
    fontforge \
    nodejs \
    npm \
    build-essential \
    libxml2-dev \
    libxslt1-dev \
    libpng-dev \
    libjpeg-dev \
    libgif-dev \
    libfreetype6-dev \
    python3 \
    python3-pip

# Clone pdf2htmlEX repository and build
RUN git clone https://github.com/coolwanglu/pdf2htmlEX.git && \
    cd pdf2htmlEX && \
    make && \
    make install

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install Node dependencies
RUN npm install

# Start the server
CMD ["npm", "start"]