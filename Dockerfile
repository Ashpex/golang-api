FROM node:16-alpine
# Create app directory
WORKDIR /app
# Bundle app src
COPY package.json ./
RUN npm install 

COPY . .

EXPOSE 5000

CMD ["npm", "start"]