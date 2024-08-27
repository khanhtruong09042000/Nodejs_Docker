FROM node:20
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
ENV PORT 5000
EXPOSE ${PORT}
CMD [ "npm", "start" ]