import { Auth } from "../models/auth.schema";
import AuthRepository from "../repositories/auth.repository";
import { IUser } from "../types/entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AuthService = {
  getAll: async () => {
    const allUser = await AuthRepository.getAll();
    return allUser;
  },

  register: async (userData: IUser) => {
    const { name, email, password } = userData;

    if(!name || !email){
      throw new Error("name and email is required");
    }

    if(password.length < 8){
      throw new Error("password should have minimum 8 characters");
    }

    const existingUser = await AuthRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const newUser = await AuthRepository.register(userData);
    return newUser;
  },

  updateUser: async (id: string, userData: IUser) => {
    const {name, password} = userData;

    if(!name){
      throw new Error("name is required");
    }

    if(password.length < 8){
      throw new Error("password should have minimum 8 characters");
    }

    const updateUser = await AuthRepository.updateUser(id, userData);
    return updateUser;
  },

  deleteUser: async (id: string) => {
    await AuthRepository.deleteUser(id);
  },

  login: async (loginData: {email: string, password: string}) => {
    const { email, password } = loginData;

    // input validation
    if (!email || password.length < 8) {
      throw new Error("email and password are required");
    }

    const user = await AuthRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatchPassword = await bcrypt.compare(password, user.password as string);

    if(!isMatchPassword){
      throw new Error("Invalid email or password");
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email
    }

    // create token
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY as string, {expiresIn: "60s"});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY as string, {expiresIn: "7d"});

    const token = {accessToken, refreshToken}

    // save token to database
    const newRefreshToken = new Auth({
      userId: user.id,
      refreshToken,
    });
    await newRefreshToken.save();

    return token;
  },
}

export default AuthService;