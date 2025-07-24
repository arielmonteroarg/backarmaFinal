import dotenv from "dotenv";
dotenv.config();

export default { 
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/",
  SECRET: process.env.SECRET || "N0S3cr3tKe44orTh1sApp((&",
  EMAIL: process.env.EMAIL,
  PASS: process.env.PASS,
  FRONT_URL: process.env.FRONT_URL,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || "1d",
}

