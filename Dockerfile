# Stage 1: Use prebuilt pdf2htmlEX image
FROM bwits/pdf2htmlex AS pdf2html-base

# Stage 2: Add Node.js app
FROM node:18-slim

# Copy pdf2htmlEX binaries from the base image
COPY --from=pdf2html-base /usr/local/bin/pdf2htmlEX /usr/local/bin/pdf2htmlEX
COPY --from=pdf2html-base /usr/local/share/fonts /usr/local/share/fonts

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Create required directories
RUN mkdir -p uploads output

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]