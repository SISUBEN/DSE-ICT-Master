FROM node:18-alpine

WORKDIR /app

# Copy package.json from the build context (project root)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the server directory from the build context (project root) to /app/server
COPY server ./server

# Create uploads directory
RUN mkdir -p server/uploads

EXPOSE 5000

# Start the server
CMD ["node", "server/index.js"]