import { Strategy } from "passport-local";
import userModel from "../../daos/mongo/models/User.js";
import CartService from "../../services/cart.service.js";   
import { createHash, isValidPassword } from "../../utils.js";

const cartService = new CartService();                      

async function verifyRegister(req, username, password, done) {
  const { first_name, last_name, age, role } = req.body;
  try {
    const userFound = await userModel.findOne({ email: username });
    if (userFound) {
      req.session.errorMessage = "User already exists";
      return done(null, false, { message: "User already exists" });
    }

    // crear carrito vía servicio
    const newCart = await cartService.createCart();     

    const newUser = {
      first_name,
      last_name,
      age,
      role,
      password: createHash(password),
      email: username,
      cart: newCart.id,
    };
    const newDoc = await userModel.create(newUser);
    return done(null, newDoc);
  } catch (error) {
    console.error(error);
    return done("Internal server error (view console)");
  }
}

async function verifyLogin(username, password, done) {
  try {
    const user = await userModel.findOne({ email: username }).lean();
    if (!user) {
      return done(null, false, { message: "Error Al iniciar Session: Credenciales Invalidas." });
    }
    if (!isValidPassword(user, password)) {
      return done(null, false, { message: "Error Al iniciar Session: Credenciales Invalidas." });
    }
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done("Internal server error (view console)");
  }
}

export const registerLocal = new Strategy(
  { usernameField: "email", passReqToCallback: true },
  verifyRegister
);
export const loginLocal = new Strategy({ usernameField: "email" }, verifyLogin);