import { Auth } from "../models/auth.schema";
import { User } from "../models/user.schema";
import { IUser } from "../types/entity";
import bcrypt from "bcrypt";

const AuthRepository = {
  getAll: async () => {
    const allUser = await User.find();
    return allUser;
  },

  getUserByEmail: async (email: string) => {
    const user = await User.findOne({email});
    return user;
  },

  register: async (userData: IUser) => {
    const {name, email, password} = userData;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, 
      email, 
      password: hashPassword
    });

    const saveUser = await newUser.save();
    return saveUser;
  },

  updateUser: async (id: string, userData: IUser) => {
    const userId = id;
    const {name, email, password} = userData;

    const hashPassword = await bcrypt.hash(password, 10);

    const updateUser = await User.findByIdAndUpdate(
      {_id: userId}, 
      {name, email, password: hashPassword}, 
      {new: true}
    );
    return updateUser;
  },
  
  deleteUser: async (id: string) => {
    const userId = id;
    await User.findByIdAndDelete(userId);
  },
}

export default AuthRepository;