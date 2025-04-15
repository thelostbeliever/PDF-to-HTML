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
    pdf2htmlex \
    nodejs \
    npm

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install Node dependencies
RUN npm install

# Start the server
CMD ["npm", "start"]