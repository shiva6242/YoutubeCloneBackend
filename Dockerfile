# Use an official Node runtime as a parent image
FROM node:14

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 8800 (the port your app runs on)
EXPOSE 8800

# Command to run the application
CMD ["node", "index.js"]
