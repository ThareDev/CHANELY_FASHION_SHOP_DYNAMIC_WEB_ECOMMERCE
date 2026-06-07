import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  whatsapp: string;
  password: string;       // bcrypt hash
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    whatsapp:  { type: String, required: true },
    password:  { type: String, required: true },
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);