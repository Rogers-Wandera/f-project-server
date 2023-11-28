const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const cloudinaryConfig = {
  cloudname: process.env.CLOUD_NAME,
  apikey: process.env.CLOUD_API_KEY,
  apisecret: process.env.CLOUD_API_SECRET,
};

module.exports = { dbConfig, cloudinaryConfig };
