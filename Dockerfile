# Use the official Node.js 18 image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package files first to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project code to the working directory
COPY . .

# Build the Next.js app and the Socket.io server
RUN npm run build:socket

# Expose port 3000 (default for your app)
EXPOSE 3000

# Set the default command to start the app
CMD ["node", ".next/standalone/server.js"]

