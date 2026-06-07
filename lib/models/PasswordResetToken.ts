import mongoose, { Schema, model, models } from "mongoose";

const PasswordResetTokenSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  token:     { type: String, required: true },          // bcrypt hash of the 6-digit code
  expiresAt: { type: Date, required: true },
});

export const PasswordResetToken =
  models.PasswordResetToken ??
  model("PasswordResetToken", PasswordResetTokenSchema);