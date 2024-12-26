import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; // Use an environment variable for production

export function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "1h" }); // Adjust expiry time
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
