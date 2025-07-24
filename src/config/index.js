import dotenv from "dotenv";
dotenv.config();

export default { 
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/",
  SECRET: process.env.SECRET || "N0S3cr3tKe44orTh1sApp((&",
  SECRET_EXPIRES_IN: process.env.SECRET_EXPIRES_IN || "1d",
  EMAIL:"arielmontero.arg@gmail.com",
  PASS:"hbolvkzhlhaarrds"
}

