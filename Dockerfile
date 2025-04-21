# Use bwits/pdf2htmlex as the base image which already includes pdf2htmlEX
FROM bwits/pdf2htmlex:alpine

# Install Node.js
RUN apk add --update nodejs npm

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