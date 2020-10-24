# NodeJs with Mongoose Boilerplate Using Express

A boilerplate for quickly building RESTful APIs using Node.js, Express, and Mongoose.

## Features
- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [JWT](https://www.npmjs.com/package/jsonwebtoken)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **File Upload**: File Upload using [multer](https://www.npmjs.com/package/multer)

## Getting Started

### Installation

Clone the repo:

```bash
git clone https://github.com/yogeshkokel/node-mongo-boilerplate.git
cd node-mongo-boilerplate
```

Install the dependencies:

```bash
npm install
```

Set the config variables:

```bash
cp -R app/configExample app/config

# open app/config/index.js and modify the variables (if needed)
```
Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run start
```