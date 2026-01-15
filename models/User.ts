import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
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

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true, // ✅ เพิ่ม
    },
  },
  {
    timestamps: true,
  }
);

// ✅ สำคัญ: ป้องกัน schema เก่าค้าง
const User = models.User || model("User", UserSchema);

export default User;
