"use server";
import { generateToken } from "../utils/jwt"; // Adjust path based on structure
import { getDB } from "../utils/db"; // Adjust path

export async function handleSignup(firstname, lastname, username, password, city) {
  try {
    const db = await getDB();
    const usersCollection = db.collection("users");

    const bcrypt = (await import("bcryptjs")).default;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await usersCollection.findOne({ username: username });
    if (existingUser) {
      return {
        result: "User already exists, use a different username instead.",
        token: null,
        username: null,
        _id: null,
        employee: false,
        resultCode: 404,
      };
    }

    const newUser = {
      firstname,
      lastname,
      username,
      password: hashedPassword,
      city,
      admin: false,
      employee: true,
      moderator: false,
    };
    const insertResult = await usersCollection.insertOne(newUser);

    // Generate a token
    const token = generateToken({ username });

    return {
      result: "Signup Successful.",
      token,
      username,
      _id: insertResult.insertedId.toString(),
      employee: newUser.employee,
      resultCode: 200,
    };
  } catch (err) {
    return {
      result: err.message,
      token: null,
      username: null,
      _id: null,
      employee: false,
      resultCode: 500,
    };
  }
}

export async function handleLogin(username, password) {
  try {
    const db = await getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      return {
        result: "Invalid username or password.",
        token: null,
        username: null,
        _id: null,
        admin: false,
        employee: false,
        moderator: false,
        resultCode: 404,
      };
    }

    const bcrypt = (await import("bcryptjs")).default;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        result: "Wrong username or password.",
        token: null,
        username: null,
        _id: null,
        admin: false,
        employee: false,
        moderator: false,
        resultCode: 404,
      };
    }

    const token = generateToken({ username: user.username });
    return {
      result: "Login Successful.",
      token,
      username: user.username,
      _id: user._id.toString(),
      admin: user.admin,
      employee: user.employee,
      moderator: user.moderator,
      resultCode: 200,
    };
  } catch (err) {
    return {
      result: err.message,
      token: null,
      username: null,
      _id: null,
      admin: false,
      employee: false,
      moderator: false,
      resultCode: 500,
    };
  }
}
