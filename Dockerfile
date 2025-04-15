FROM ubuntu:22.04

# Set non-interactive mode to avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install necessary packages
RUN apt-get update && \
    apt-get install -y \
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
    libgif-dev \
    libfreetype6-dev \
    python3 \
    python3-pip \
    automake && \
    rm -rf /var/lib/apt/lists/*

# Clone and build pdf2htmlEX
RUN git clone https://github.com/coolwanglu/pdf2htmlEX.git /pdf2htmlEX && \
    cd /pdf2htmlEX && \
    make && \
    make install

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Node.js dependencies
RUN npm install

# Start the server
CMD ["npm", "start"]