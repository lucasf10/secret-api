const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;
dotenv.config();

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    { useNewUrlParser: true }
)

module.exports = mongoose;