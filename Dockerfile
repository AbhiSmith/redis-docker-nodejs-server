# Use a base image that includes Node.js and npm
FROM node:latest

# Install Redis server
RUN apt-get update && apt-get install -y redis-server

# Set working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 6379 to allow access to Redis
EXPOSE 6379

# Command to start the Node.js application
CMD [ "npm", "start" ]
