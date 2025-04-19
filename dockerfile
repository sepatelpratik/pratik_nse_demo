# Use the official Node.js image as base
FROM node:18-alpine

# Install dependencies needed for Puppeteer in Alpine
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose any necessary ports (if your app has a server)
# EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]