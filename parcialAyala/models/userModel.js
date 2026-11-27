import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  birthDate: {
    type: Date,
    required: true,
  },

  sign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signs",
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  rol: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

}, { timestamps: true });

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;