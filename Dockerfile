# Use a base image that has pdf2htmlEX pre-installed
FROM bwits/pdf2htmlex

# Install Node.js (LTS version) and npm
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# Set working directory
WORKDIR /app

# Copy app files
COPY package.json ./
RUN npm install
COPY . .

# Create upload/output folders
RUN mkdir -p uploads output

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]