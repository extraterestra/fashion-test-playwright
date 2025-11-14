FROM mcr.microsoft.com/playwright:v1.56.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Install Playwright browsers (already included in base image, but ensures latest)
RUN npx playwright install --with-deps

# Default command
CMD ["npm", "run", "test:test"]