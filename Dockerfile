FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3005
EXPOSE 7000

# Command to run the application
CMD ["npm", "run", "develop"]
