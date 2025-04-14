import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET; 


export const signToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY); 
};


export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
