# Use debian:bullseye-slim as base
FROM debian:bullseye-slim

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and pdf2htmlEX
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y \
    nodejs \
    poppler-utils \
    pdf2htmlex \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app directory explicitly
RUN mkdir -p /app

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create directories for uploads and output with proper permissions
RUN mkdir -p uploads output && chmod 777 uploads output

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]