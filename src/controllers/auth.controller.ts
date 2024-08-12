import { Request, Response } from "express";
import AuthService from "../services/auth.services";
import { Auth } from "../models/auth.schema";
import jwt from "jsonwebtoken";

const UserController = {
  handleGetAll: async (req: Request, res: Response) => {
    try {
      const allUser = await AuthService.getAll();
      return res.status(200).json({message: "success get all user" , data: allUser});
    } catch (error) {
      console.log(error);
    }
  },

  handleRegister: async (req: Request, res: Response) => {
    try {
      const {name, email, password} = req.body;
      const newUser = await AuthService.register({name, email, password});

      return res.status(201).json({message: "success create account" , data: newUser});
    } catch (error: any) {
      console.log(error);
      if(error.message == "name and email is required"){
        return res.status(400).json({message: "name and email is required"});
      }

      if(error.message == "password should have minimum 8 characters"){
        return res.status(400).json({message: "password should have minimum 8 characters"});
      }

      if(error.message == "Email is already registered"){
        return res.status(409).json({message: "Email is already registered"});
      }
    }
  },

  handleUpdateUser: async (req: Request, res: Response) => {
    try {
      const {accessToken} = req.cookies;

      const payload = jwt.decode(accessToken) as { id: string; name: string; email: string };

      const {name, email, password} = req.body;
      const updateUser = await AuthService.updateUser(payload.id, {name, email, password});
      return res.status(200).json({message: "success update account" , data: updateUser});
    } catch (error: any) {
      console.log(error);
      if(error.message == "name is required"){
        return res.status(400).json({message: "name is required"});
      }

      if(error.message == "password should have minimum 8 characters"){
        return res.status(400).json({message: "password should have minimum 8 characters"});
      }
    }
  },

  handleDeleteUser: async (req: Request, res: Response) => {
    try {
      const {accessToken} = req.cookies;

      const payload = jwt.decode(accessToken) as { id: string; name: string; email: string };

      await AuthService.deleteUser(payload.id);
      return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({message: "success delete account"});
    } catch (error) {
      console.log(error);
    }
  },

  handleLoginUser: async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body;
      const token = await AuthService.login({email, password});

      const {accessToken, refreshToken} = token;
      
      return res
              .status(200)
              .cookie("accessToken", accessToken, {httpOnly: true})
              .cookie("refreshToken", refreshToken, {httpOnly: true})
              .json({message: "success login user"});
    } catch (error: any) {
      console.log(error);
      if (error.message == "email and password are required") {
        return res.status(400).json({message: error.message});
      }

      if (error.message == "Invalid email or password") { 
        return res.status(401).json({message: error.message});
      }
    }
  },

  handleLogoutUser: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    // delete token di DB
    await Auth.findOneAndDelete({
      refreshToken,
    });

    return res.clearCookie("accessToken").clearCookie("refreshToken").json({ message: "Logout success" });
  }
};

export default UserController;