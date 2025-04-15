# Use image with pdf2htmlEX pre-installed
FROM bwits/pdf2htmlex:latest

# Install Node.js (via Alpine package manager)
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /app

# Copy project files
COPY package.json ./
RUN npm install
COPY . .

# Create required folders
RUN mkdir -p uploads output

# Expose your app’s port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]