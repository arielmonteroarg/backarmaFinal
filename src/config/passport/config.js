import passport from "passport";
import { registerLocal, loginLocal } from "./local.strategy.js"
import userModel from "../../daos/mongo/models/user.model.js";


import jwt from "passport-jwt"; 
import dotenv from "dotenv";
dotenv.config();

  
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookeieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  }
  return token;
} 

const initializedPassport = () => {
  // Estrategias
  passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookeieExtractor]),
    secretOrKey: process.env.SECRET   
  }, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id).lean();; 
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      delete user.password; // Eliminar la contraseña del objeto usuario
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done("Internal server error (view console)");
    }
  }
  ));
  passport.use("login", loginLocal); // Estrategia de login
  passport.use("register", registerLocal)   

  // Serealizacion
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id).lean();
    delete user.password;
    done(null, user);
  });
}

export default initializedPassport
