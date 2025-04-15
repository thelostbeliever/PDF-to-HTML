# Use a base image that already includes pdf2htmlEX
FROM minidocks/pdf2htmlex:latest as pdf2htmlex

# Use Node.js official image
FROM node:18-slim

# Copy pdf2htmlEX from the minidocks image
COPY --from=pdf2htmlex /usr/local/bin/pdf2htmlEX /usr/local/bin/
COPY --from=pdf2htmlex /usr/local/share/pdf2htmlEX /usr/local/share/pdf2htmlEX
COPY --from=pdf2htmlex /lib/ /lib/
COPY --from=pdf2htmlex /usr/lib/ /usr/lib/
COPY --from=pdf2htmlex /usr/local/lib/ /usr/local/lib/
COPY --from=pdf2htmlex /usr/share/fonts/ /usr/share/fonts/
COPY --from=pdf2htmlex /usr/share/poppler/ /usr/share/poppler/

# Set up library paths
ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/lib:/lib

# Create app directory first
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