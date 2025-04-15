# Use Ubuntu as the base image
FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install pdf2htmlEX and dependencies
RUN apt-get update && apt-get install -y \
    pdf2htmlex \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir -p /app
# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create directories for uploads and output
RUN mkdir -p uploads output

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]